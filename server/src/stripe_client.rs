// use axum::extract::Json;
use stripe::{Client, Customer, ListCustomers};
// use serde::{Deserialize, Serialize};

pub struct StripeClient {}

impl StripeClient {
    pub async fn get_customer(email: &str) -> Option<Customer> {
        let secret_key = std::env::var("STRIPE_SECRET_KEY").expect("STRIPE_SECRET_KEY must be set");

        let client = Client::new(secret_key);

        let mut list_customers = ListCustomers::new();
        list_customers.email = Some(email);

        match Customer::list(&client, &list_customers).await {
            Ok(customers) => customers.data.into_iter().next(),
            Err(err) => {
                eprintln!("Error retrieving customer: {:?}", err);
                None
            }
        }
    }

    pub async fn get_subscription(customer: &Customer) -> Option<stripe::Subscription> {
        let secret_key = std::env::var("STRIPE_SECRET_KEY").expect("STRIPE_SECRET_KEY must be set");
        let client = Client::new(secret_key);

        let mut list_subscriptions = stripe::ListSubscriptions::new();
        list_subscriptions.customer = Some(customer.id.clone());

        match stripe::Subscription::list(&client, &list_subscriptions).await {
            Ok(subscriptions) => subscriptions.data.into_iter().next(),
            Err(err) => {
                eprintln!("Error retrieving subscription: {:?}", err);
                None
            }
        }
    }

    pub async fn cancel_subscription(email: &str) -> Option<stripe::Subscription> {
        let secret_key = std::env::var("STRIPE_SECRET_KEY").expect("STRIPE_SECRET_KEY must be set");
        let client = Client::new(secret_key);

        // First get the customer
        let customer = Self::get_customer(email).await?;

        // Then get their subscription
        let subscription = Self::get_subscription(&customer).await?;

        // Cancel the subscription
        // todo - add a feedback field to front-end and pass here to collect "reasons" for cancellation
        match stripe::Subscription::cancel(
            &client,
            &subscription.id,
            stripe::CancelSubscription::new(),
        )
        .await
        {
            Ok(sub) => {
                println!("Subscription canceled: {:?}", sub);
                // Fetch the updated subscription to get the current status
                // match stripe::Subscription::retrieve(&client, &subscription.id, &[]).await {
                //     Ok(updated_subscription) => Some(updated_subscription),
                //     Err(err) => {
                //         eprintln!("Error retrieving updated subscription: {:?}", err);
                //         None
                //     }
                // }
                return Some(sub);
            },
            Err(err) => {
                eprintln!("Error canceling subscription: {:?}", err);
                None
            }
        }
    }
}
