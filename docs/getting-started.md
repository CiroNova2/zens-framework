# Getting Started with Zens Framework

This guide will help you set up and start using the Zens Framework for creating intelligent agent-based city simulations.

## Installation

1. **System Requirements**
   - Node.js (version 14 or higher)
   - npm (Node.js package manager)
   - OpenAI API key

2. **Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/CiroNova2/zens-framework.git
   cd zens-framework

   # Install dependencies
   npm install

   # Configure environment
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

## Core Commands (Stable Features)

### Initialize a New City
```bash
npm run initiate [theme]
```
- `theme` (optional): Description of your city's theme
- Default theme: "A diverse solarpunk city with a mix of cultures"
- Creates 10 initial citizens and establishes basic relationships

Example:
```bash
npm run initiate "Coastal Tech Hub"
```

### Add New Citizens
```bash
npm run addCitizens [count] [name] [age] [occupation]
```
Parameters:
- `count`: Number of citizens to add (Default 5 if not followed by any specific parameters)
- `name`: Full name in quotes (optional)
- `age`: Age as a number (optional)
- `occupation`: Occupation in quotes (optional)

Examples:
```bash
# Add 5 random citizens
npm run addCitizens 5

# Add a specific citizen
npm run addCitizens 1 "John Doe" 35 "Software Engineer"

```

### Generate Interactions
```bash
npm run addInteractions
```
- Creates random interactions between existing citizens
- Builds relationships and memories
- Updates social networks

### Chat with Citizens
```bash
npm run chat [firstName] [lastName]
```
- Start a conversation with a specific citizen
- If no name provided, selects a random citizen
- Use `exit` to end conversation

Example:
```bash
npm run chat John Doe
```

### Create Specific Interactions
```bash
npm run specificInteraction
```
- Choose specific citizens to interact
- Define interaction type and context
- System generates detailed interaction narrative

## Data Structure

### Character Data
Located in `data/characters.json`:
```json
{
  "citizens": [
    {
      "id": "uuid",
      "name": "Citizen Name",
      "age": 30,
      "occupation": "Occupation",
      "traits": ["trait1", "trait2"],
      "values": ["value1", "value2"],
      "background": "Personal history",
      "relationships": [],
      "memories": []
    }
  },
  "indexes": {
    "byOccupation": {}
  },
  "metadata": {
    "lastUpdate": "timestamp",
    "version": "1.0",
    "count": 0,
    "theme": "City Theme",
    "createdAt": "timestamp"
  }
}
```

## Troubleshooting Common Issues

1. **API Key Issues**
   - Ensure `.env` file exists and contains valid API key
   - Check API key permissions and quota

2. **Character Generation Fails**
   - Verify `characters.json` exists and is valid JSON
   - Check write permissions in `data` directory

3. **Interaction Issues**
   - Ensure at least 2 citizens exist in the simulation
   - Check for valid citizen IDs/names

---

> **Note**: The following features are in development and not yet fully integrated:
> - Multi-city system
> - Economic system
> - Internet connectivity
> - Cultural events
> - Education system
> 
> Please refer to the extensions documentation for more information about upcoming features. 