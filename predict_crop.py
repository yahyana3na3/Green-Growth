import sys
import pandas as pd
import pickle

# Load the trained model
model = pickle.load(open('crop_prediction_model.pkl', 'rb'))

def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    input_data = pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]],
                              columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
    prediction = model.predict(input_data)
    return prediction[0]

if __name__ == "__main__":
    # Command line arguments for the input
    N = float(sys.argv[1])
    P = float(sys.argv[2])
    K = float(sys.argv[3])
    temperature = float(sys.argv[4])
    humidity = float(sys.argv[5])
    ph = float(sys.argv[6])
    rainfall = float(sys.argv[7])

    # Getting the prediction
    result = predict_crop(N, P, K, temperature, humidity, ph, rainfall)
    print(result)  # Output the result
