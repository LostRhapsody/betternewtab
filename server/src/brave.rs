use anyhow::Result;
use reqwest::Client;
use serde::{Deserialize, Serialize};

pub struct Brave {
    client: Client,
    url: String,
    api_key: String,
}

#[derive(Debug, Deserialize)]
pub struct SuggestResponse {
    #[serde(rename = "type")]
    pub response_type: String,
    pub query: Query,
    pub results: Vec<Suggestion>,
}

#[derive(Debug, Deserialize)]
pub struct Query {
    pub original: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Suggestion {
    pub query: String,
}

impl Brave {
    pub fn new(url: String, api_key: String) -> Result<Self> {
        let client = Client::new();
        Ok(Self {
            client,
            url: url.to_string(),
            api_key: api_key.to_string(),
        })
    }

    pub async fn get_suggestions(&self, query: &str) -> Result<SuggestResponse> {
        let response = self.client
            .get(&self.url)
            .header("X-Subscription-Token", &self.api_key)
            .query(&[
                ("q", query),
                ("country", "US"),
                ("rich", "false"),
            ])
            .send()
            .await?;

        println!("Status: {}", response.status());

        let suggestions = response.json::<SuggestResponse>().await?;
        println!("Suggestions: {:?}", suggestions);
        Ok(suggestions)
    }

}