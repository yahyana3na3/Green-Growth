import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle

# Load the dataset
data = pd.read_csv('crop_recommendation.csv')

# Splitting the dataset into features and target
features = data[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
target = data['label']

# Splitting the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

# Creating the model
model = RandomForestClassifier(n_estimators=100, random_state=42)

# Training the model
model.fit(X_train, y_train)

# Predicting on the test set
predictions = model.predict(X_test)

# Evaluating the model
accuracy = accuracy_score(y_test, predictions)
print("Accuracy of the model:", accuracy)

# Save the model to disk
filename = 'crop_prediction_model.pkl'
pickle.dump(model, open(filename, 'wb'))

print("Model saved successfully!")
