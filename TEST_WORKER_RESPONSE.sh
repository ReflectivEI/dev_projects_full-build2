#!/bin/bash

# Test what the Worker actually returns for exercises

curl -X POST https://reflectivai-app-parity-prod.tonyabdelmalak.workers.dev/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "system",
        "content": "You are an EI coach. Return ONLY a JSON array of 3-5 exercises. Each exercise must have: title, description, practiceSteps (array), scenario, reflectionPrompts (array). Return ONLY the JSON array, no markdown, no explanation. JSON array only:"
      },
      {
        "role": "user",
        "content": "Generate practice exercises"
      }
    ]
  }' | jq . || cat
