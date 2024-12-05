# E-Commerce Transaction Anomaly Detection

This project focuses on detecting anomalous or fraudulent patterns in e-commerce transactions using unsupervised machine learning techniques. It analyzes customer behavior, purchase frequency, and time-based patterns to identify unusual transaction activities that may indicate fraud.

## Features
-   Detect anomalies in transaction data using:
  - Clustering (e.g., K-Means, DBSCAN)
  - Isolation Forest
  - Autoencoders
-   Analyze behavioral and temporal transaction patterns.
-   Visualize anomalies for better interpretation.

## Technologies Used
-   Programming Language: Python
-   Key Libraries:
    - pandas and numpy for data manipulation.
    - scikit-learn for machine learning models.
    - matplotlib and seaborn for visualization.
    - tensorflow or keras for autoencoder implementation.

## Installation Guide
### Prerequisites
Make sure you have the following installed on your system:

-   Python 3.8 or higher
-   Pip (Python package manager)

### Steps to Set Up
Clone the repository:

```bash
git clone https://github.com/Kailash51/Neural-Nexus-AI-ML.git
cd Neural-Nexus-AI-ML
Create and activate a virtual environment (optional but recommended):

``` bash
python -m venv env
source env/bin/activate   # For Linux/Mac
env\Scripts\activate      # For Windows
Install required dependencies:

``` bash
pip install -r requirements.txt
Run the project:

``` bash  
python main.py
```

## Usage Instructions
Add Dataset:

Place your dataset file (in CSV format) into the data/ directory.
Ensure the dataset includes columns such as customer details, items purchased, transaction amounts, and timestamps.
Update Configuration:

Modify the config.py file with your dataset path and model parameters.
Run Models:

To run the anomaly detection:
``` bash
python anomaly_detection.py
View Results:

Check the outputs and visualizations in the outputs/ directory.

##  Project Workflow
1. Data Preprocessing
    - Clean and normalize the data.
    - Handle missing values and encode categorical variables.
2. Feature Engineering
    - Extract behavioral features (e.g., transaction frequency, purchase amount).
    - Derive temporal features (e.g., transaction timestamps).
3. Model Application
    - Apply the following models for anomaly detection:
        - Clustering (K-Means, DBSCAN) to group similar transactions.
        - Isolation Forest for identifying outliers.
        - Autoencoders to detect anomalies with reconstruction errors.
4. Evaluation and Visualization
    - Evaluate using Silhouette Score, reconstruction errors, and anomaly scores.
    - Visualize anomalies in scatter plots and histograms.

## Key Models
1. Clustering
    - Groups transactions based on similarity to detect abnormal clusters.
2. Isolation Forest
    - Flags transactions that are isolated and deviate from the majority.
3. Autoencoders
    - Uses neural networks to reconstruct data patterns and detect anomalies with high reconstruction errors.

## Sample Results

### Visualization Example

### Detected Anomalies

- Transaction ID	Amount	Anomaly Score	Status
- 12345	$9,999.00	0.95	Anomalous
- 67890	$1.25	0.10	Normal

## Folder Structure

```bash
Neural-Nexus-AI-ML/
├── data/
│   └── transactions.csv       # Dataset file
├── outputs/
│   ├── anomaly_graph.png      # Visualizations
│   └── results.csv            # Anomaly results
├── models/
│   └── autoencoder_model.h5   # Saved Autoencoder model
├── scripts/
│   ├── data_preprocessing.py  # Data cleaning script
│   ├── anomaly_detection.py   # Anomaly detection models
│   └── visualization.py       # Visualization script
├── main.py                    # Main script
├── config.py                  # Configuration file
└── requirements.txt           # Dependencies
```
##  Contributors
-   Sumit Saxena
-   Email: sumitsaxenah806@gmail.com

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
