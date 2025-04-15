GitHub Pages link: https://Sarthak-Mishra2105.github.io/iss-a3/personal-website/

Assumptions for Part 2:
   - Format strictly follows assignment requirement: Timestamp, event type, event object
   - Example log format: "2025-04-15T10:30:12.345Z, click, button: analyze-btn"
   - Timestamp uses ISO format for precision and standardization
   - Element identifiers are determined in this priority order: 
     1. ID attribute
     2. Class name
     3. Alt text (for images)
     4. Text content
     5. Tag name
   - Prevents duplicate view events by unobserving elements after first view
   - Uses custom function to determine element type based on tag and context

2. Assumptions for Part 3:
    - Words are separated by spaces and punctuation
    - Words are case-insensitive
    - The limit of 10000 words is just superficial, and the code is designed to handle larger inputs efficiently without crashing.
    - Smaller inputs work as well.
