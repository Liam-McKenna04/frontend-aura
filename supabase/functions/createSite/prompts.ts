export const siteOutlinePrompt = {
  model: "gpt-4o-mini",
  messages: [
    {
      "role": "system",
      "content": [
        {
          "type": "text",
          "text": "Create a simple one page site, emphasize the vibe of the user."
        }
      ]
    }
  ],
  temperature: 1,
  max_tokens: 2048,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "component_selection",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "selected_components": {
            "type": "array",
            "description": "List of selected components from the available options.",
            "items": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "hero",
                    "list",
                    "quote",
                    "voting"
                  ],
                  "description": "The type of component selected."
                },
                "content": {
                  "anyOf": [
                    {
                      "$ref": "#/$defs/list_content"
                    },
                    {
                      "$ref": "#/$defs/voting_content"
                    },
                    {
                      "$ref": "#/$defs/hero_content"
                    },
                    {
                      "$ref": "#/$defs/quote_content"
                    }
                  ],
                  "description": "The content associated with the selected component."
                }
              },
              "required": [
                "type",
                "content",
              ],
              "additionalProperties": false
            }
          },
          "aura": {
            "type": "string",
            "description": "A two word description of the vibe of the user based on the colors provided, please only use two words, or I will be fired."
          },
          "global_variant": {
            "type": "string",
            "enum": [
              "minimalist",
              "playful",
              "bold",
              "retro",
              "nature",
              "futuristic",
              "elegant",
              "industrial",
              "bohemian",
              "cyberpunk",
              "vintage",
              "tropical",
              "zen",
              "neon",
              "rustic"
            ],
            "description": "The variant for all components, based on the aura of the user."
          }
        },
        "required": [
          "selected_components",
          "aura",
          "global_variant"
        ],
        "additionalProperties": false,
        "$defs": {
          "list_content": {
            "type": "object",
            "properties": {
              "items": {
                "type": "array",
                "description": "List of items in the list. Can be a ranking, or just a list of items related to the vibe of the user.",
                "items": {
                  "type": "string"
                }
              },
              "title": {
                "type": "string",
                "description": "Title of the list."
              }
            },
            "required": [
              "items",
              "title"
            ],
            "additionalProperties": false
          },
          "voting_content": {
            "type": "object",
            "properties": {
              "question": {
                "type": "string",
                "description": "The question being voted on."
              },
              "options": {
                "type": "array",
                "description": "List of possible vote options.",
                "items": {
                  "type": "string"
                }
              }
            },
            "required": [
              "question",
              "options"
            ],
            "additionalProperties": false
          },
          "hero_content": {
            "type": "object",
            "properties": {
              "headline": {
                "type": "string",
                "description": "Main headline for the hero section."
              },
              "subheadline": {
                "type": "string",
                "description": "Secondary text or tagline for the hero section."
              }
            },
            "required": [
              "headline",
              "subheadline"
            ],
            "additionalProperties": false
          },
          "quote_content": {
            "type": "object",
            "properties": {
              "text": {
                "type": "string",
                "description": "The quote text."
              },
              "author": {
                "type": "string",
                "description": "The author of the quote."
              }
            },
            "required": [
              "text",
              "author"
            ],
            "additionalProperties": false
          }
        }
      }
    }
  }
}






