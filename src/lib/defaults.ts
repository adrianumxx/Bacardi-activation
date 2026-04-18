export const DEFAULT_ATTRIBUTE_SCHEMA = `[
  {"key":"monthly_cases","label":"Casse mensili (stima)","type":"number"},
  {"key":"has_bar_license","label":"Licenza bar attiva","type":"boolean"}
]`;

export const DEFAULT_REQUIREMENTS_JSON = `{
  "rules": [
    {
      "id": "monthly_cases",
      "key": "monthly_cases",
      "op": "gte",
      "value": 10,
      "messageIt": "Servono almeno 10 casse mensili per questa attivazione."
    },
    {
      "id": "has_bar_license",
      "key": "has_bar_license",
      "op": "equals",
      "value": true,
      "messageIt": "È richiesta licenza bar attiva."
    }
  ]
}`;
