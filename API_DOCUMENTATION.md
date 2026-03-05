# API Documentation - Style Atlas

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Endpoints

### POST /api/recommendations

Get clothing recommendations based on country, culture, and weather.

#### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "country": "India"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|--------|----------|--------------------------------|
| country | string | Yes | Name of the country (e.g., "India", "Japan", "USA") |

#### Response

**Success (200 OK):**

```json
{
  "weather": {
    "temp": 28,
    "description": "clear sky",
    "humidity": 65,
    "windSpeed": 12
  },
  "recommendations": [
    {
      "category": "Traditional Wear",
      "items": ["Light Saree", "Breathable Cotton Kurta"],
      "culturalContext": "Authentic India traditional clothing that reflects local heritage and customs.",
      "weatherReason": "Lightweight fabrics for hot weather comfort"
    },
    {
      "category": "Modern Fusion",
      "items": ["Indo-western fusion", "Contemporary kurtas", "Stylish accessories"],
      "culturalContext": "Contemporary India fashion blending tradition with modern aesthetics.",
      "weatherReason": "Modern interpretations suitable for current weather"
    },
    {
      "category": "Seasonal Essentials",
      "items": [
        "Sun-protective wide-brimmed hat",
        "UV-blocking sunglasses",
        "Light, breathable sandals"
      ],
      "culturalContext": "Practical accessories popular in India for daily comfort.",
      "weatherReason": "Hot weather protection and comfort"
    }
  ],
  "location": "New Delhi"
}
```

**Error (400 Bad Request):**

```json
{
  "error": "Country is required"
}
```

**Error (404 Not Found):**

```json
{
  "error": "Country not found. Try major countries like USA, India, Japan, UK, etc."
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to generate recommendations"
}
```

## Supported Countries

Currently supports 25+ countries including:

| Region            | Countries                                                                 |
| ----------------- | ------------------------------------------------------------------------- |
| **North America** | USA, Canada, Mexico                                                       |
| **Europe**        | UK, France, Germany, Italy, Spain, Russia, Turkey                         |
| **Asia**          | India, Japan, China, South Korea, Pakistan, Bangladesh, Saudi Arabia, UAE |
| **Africa**        | Egypt, Nigeria, South Africa                                              |
| **Oceania**       | Australia                                                                 |
| **South America** | Brazil                                                                    |

## Usage Examples

### JavaScript/TypeScript (Fetch API)

```typescript
const response = await fetch('/api/recommendations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ country: 'Japan' }),
});

const data = await response.json();
console.log(data);
```

### JavaScript/TypeScript (Axios)

```typescript
import axios from 'axios';

const { data } = await axios.post('/api/recommendations', {
  country: 'France',
});

console.log(data);
```

### cURL

```bash
curl -X POST http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"country": "India"}'
```

### Python (requests)

```python
import requests

response = requests.post(
    'http://localhost:3000/api/recommendations',
    json={'country': 'Japan'}
)

data = response.json()
print(data)
```

## Weather Data

The API integrates with OpenWeatherMap to provide real-time weather data:

- **Temperature**: In Celsius
- **Description**: Weather condition (clear sky, rain, clouds, etc.)
- **Humidity**: Percentage
- **Wind Speed**: In km/h

### Fallback Behavior

If the weather API fails or is not configured:

- Mock weather data is used
- Temperature defaults to 25°C
- Description: "pleasant weather"

## Recommendation Logic

The AI generates recommendations based on three factors:

### 1. Cultural Data

- Traditional clothing styles
- Modern fashion trends
- Popular fabrics
- Color preferences

### 2. Weather Conditions

- **Hot (>30°C)**: Light, breathable fabrics, sun protection
- **Warm (25-30°C)**: Comfortable, versatile clothing
- **Mild (15-25°C)**: Layering options, moderate fabrics
- **Cool (<15°C)**: Warm layers, insulated materials
- **Rain**: Water-resistant options

### 3. Categories

- **Traditional Wear**: Authentic cultural garments
- **Modern Fusion**: Contemporary styles with cultural elements
- **Seasonal Essentials**: Weather-appropriate accessories

## Rate Limits

### Development

- No rate limits

### Production (Recommended)

- Implement rate limiting based on IP address
- Suggested: 100 requests per hour per IP
- Weather API free tier: 1000 calls/day

## Error Handling

All errors return appropriate HTTP status codes and JSON responses:

| Status Code | Meaning                                     |
| ----------- | ------------------------------------------- |
| 200         | Success                                     |
| 400         | Bad Request (missing or invalid parameters) |
| 404         | Country not found                           |
| 500         | Internal Server Error                       |

## Environment Variables

Required for full functionality:

```env
# Optional but recommended for real weather data
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key

# Future enhancements (optional)
HUGGINGFACE_API_KEY=your_huggingface_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

## Future API Endpoints (Planned)

### GET /api/countries

List all supported countries

### GET /api/cultures/:country

Get detailed cultural information for a specific country

### POST /api/preferences

Save user preferences for personalized recommendations

### GET /api/trends

Get global fashion trends

## Webhook Integration (Future)

Subscribe to weather updates for automatic recommendations:

```json
POST /api/webhooks/subscribe
{
  "country": "India",
  "email": "user@example.com"
}
```

## SDKs (Coming Soon)

- JavaScript/TypeScript SDK
- Python SDK
- Mobile SDKs (iOS/Android)

## Support

For API support:

- Email: api@styleatlas.com
- Documentation: https://styleatlas.com/docs
- GitHub Issues: https://github.com/styleatlas/issues

---

**API Version**: 1.0.0  
**Last Updated**: February 2026
