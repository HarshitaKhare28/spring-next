package com.example.backend.controller;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/hf")
public class HuggingFaceProxyController {

    private static final Logger log = LoggerFactory.getLogger(HuggingFaceProxyController.class);

    @Value("${huggingface.api.token:}")
    private String hfToken;

    @Value("${huggingface.model:mistralai/Mistral-7B-Instruct-v0.3}")
    private String huggingfaceModel;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/{owner}/{model}")
    public ResponseEntity<?> proxy(@PathVariable String owner, @PathVariable String model, @RequestBody Map<String, Object> body) {
        if (hfToken == null || hfToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Hugging Face token not configured"));
        }

        // Use the Hugging Face Router endpoint (router.huggingface.co) — api-inference.huggingface.co is deprecated
        String url = String.format("https://router.huggingface.co/models/%s/%s", owner, model);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(hfToken);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            log.info("Forwarding request to Hugging Face model: {}", url);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            int statusCode = response.getStatusCodeValue();
            String respBody = response.getBody();
            log.debug("Hugging Face response status: {} body: {}", statusCode, respBody);

            if (respBody == null || respBody.isBlank()) {
                return ResponseEntity.status(statusCode).contentType(MediaType.APPLICATION_JSON).body(Map.of());
            }
            try {
                Object json = objectMapper.readValue(respBody, Object.class);
                return ResponseEntity.status(statusCode).contentType(MediaType.APPLICATION_JSON).body(json);
            } catch (Exception parseEx) {
                log.warn("Failed to parse Hugging Face response as JSON, returning raw text", parseEx);
                return ResponseEntity.status(statusCode).contentType(MediaType.APPLICATION_JSON).body(Map.of("raw", respBody));
            }
        } catch (RestClientException ex) {
            log.error("Error contacting Hugging Face API", ex);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error", "failed to contact Hugging Face API", "   details", ex.getMessage()));
        }
    }

    @GetMapping("/diag")
    public ResponseEntity<?> diag() {
        String host = "router.huggingface.co";
        HashMap<String, Object> result = new HashMap<>();
        try {
            InetAddress addr = InetAddress.getByName(host);
            result.put("hostResolved", true);
            result.put("ip", addr.getHostAddress());
        } catch (UnknownHostException uhe) {
            result.put("hostResolved", false);
            result.put("error", uhe.getMessage());
            return ResponseEntity.ok(result);
        }

        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, 443), 5000);
            result.put("tcpConnect", true);
        } catch (Exception e) {
            result.put("tcpConnect", false);
            result.put("tcpError", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/default")
    public ResponseEntity<?> proxyDefault(@RequestBody Map<String, Object> body) {
        if (hfToken == null || hfToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Hugging Face token not configured"));
        }

        // huggingfaceModel expected in the form owner/model
        String modelPath = huggingfaceModel;
        String url = String.format("https://router.huggingface.co/models/%s", modelPath);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(hfToken);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            log.info("Forwarding request to Hugging Face default model: {}", modelPath);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            int statusCode = response.getStatusCodeValue();
            String respBody = response.getBody();
            log.debug("Hugging Face response status: {} body: {}", statusCode, respBody);

            if (respBody == null || respBody.isBlank()) {
                return ResponseEntity.status(statusCode).contentType(MediaType.APPLICATION_JSON).body(Map.of());
            }
            try {
                Object json = objectMapper.readValue(respBody, Object.class);
                return ResponseEntity.status(statusCode).contentType(MediaType.APPLICATION_JSON).body(json);
            } catch (Exception parseEx) {
                log.warn("Failed to parse Hugging Face response as JSON, returning raw text", parseEx);
                return ResponseEntity.status(statusCode).contentType(MediaType.APPLICATION_JSON).body(Map.of("raw", respBody));
            }
        } catch (RestClientException ex) {
            log.error("Error contacting Hugging Face API", ex);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error", "failed to contact Hugging Face API", "details", ex.getMessage()));
        }
    }
}
