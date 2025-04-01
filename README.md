# ಅಕ್ಷರ ಕಲಿ - Kannada Alphabet Learning Application

**ಅಕ್ಷರ ಕಲಿ** (*Akshara Kali*) is an interactive Kannada alphabet learning application designed to help children learn and practice Kannada script through guided tracing and personalized progress tracking. The platform integrates a **CNN-based handwriting recognition model** to evaluate handwriting accuracy and enhance learning outcomes. 

The application is built using **Next.js** for the frontend, with **NextAuth.js** for authentication and **Tailwind CSS** for styling. The backend is powered by **FastAPI**, with **MongoDB** managing user progress and authentication data. The handwriting recognition model is developed using **TensorFlow/Keras**, with **OpenCV** for image preprocessing.

## Demo

### Landing Page

![Screenshot from 2025-03-15 13-37-06](https://github.com/user-attachments/assets/b4467a2f-1767-4206-924e-2ac778d46005)


![Screenshot from 2025-03-15 13-38-10](https://github.com/user-attachments/assets/ffa9fa8c-0225-4c88-93f3-1b76079ab783)

![Screenshot from 2025-03-15 13-38-36](https://github.com/user-attachments/assets/47e79419-8bd0-45c6-a59b-a6e9a6a63b01)

![Screenshot from 2025-03-15 13-38-47](https://github.com/user-attachments/assets/71af1a3e-9c1e-4fbd-a64d-07dea75b9bb5)

![Screenshot from 2025-03-15 13-38-57](https://github.com/user-attachments/assets/016eed95-4982-4e4f-95a1-1f068eb1c332)

![Screenshot from 2025-03-15 13-39-17](https://github.com/user-attachments/assets/4d40b6ee-b31f-4c90-aa64-68ee92fdd439)

![Screenshot from 2025-03-15 13-39-31](https://github.com/user-attachments/assets/f22214ca-45c9-409f-87bb-6cfc7b8b3d8e)

![Screenshot from 2025-03-15 13-39-43](https://github.com/user-attachments/assets/fd3ad490-cc0f-4bce-be3e-cbae6162b229)


![Screenshot from 2025-03-15 13-39-54](https://github.com/user-attachments/assets/813f903e-c95c-4b1d-9e0a-0948dcfdbe96)

###  OAuth Page

![Screenshot from 2025-03-15 13-40-14](https://github.com/user-attachments/assets/4f8a6516-01e5-42c9-afe3-b029860fe8d0)

### Menu 

![image](https://github.com/user-attachments/assets/93b880c2-8624-436a-89d2-cf5d04d69b64)

### Practice Module

![Screenshot from 2025-03-15 13-41-17](https://github.com/user-attachments/assets/a17e201e-94c0-484d-a109-45ec40e1bdfc)

![Screenshot from 2025-03-15 13-41-32](https://github.com/user-attachments/assets/4c4c7916-1ce0-4fe8-907b-f8eec1845b7d)

![Screenshot from 2025-03-15 13-41-48](https://github.com/user-attachments/assets/33317cd7-46c5-491a-921f-e7d7aa21b639)


![Screenshot from 2025-03-15 13-42-06](https://github.com/user-attachments/assets/f177b7bb-1b85-4c6a-a8d0-e73a8c6550cb)

### Learn Module

![Screenshot from 2025-03-18 03-24-53](https://github.com/user-attachments/assets/15f55238-1b85-4644-a30e-e205a840d05b)

![Screenshot from 2025-03-18 03-25-11](https://github.com/user-attachments/assets/3a5a9b00-8eef-4ef0-be58-22524d1b5e03)

![Screenshot from 2025-03-18 03-25-50](https://github.com/user-attachments/assets/99ed8976-ce40-4de0-85e0-ccec51e71cd2)

### Progress

![Screenshot from 2025-03-31 02-25-26](https://github.com/user-attachments/assets/80d3a7b9-45a8-47f1-9b9e-2be79238b8cb)

### Mini Games

![Screenshot from 2025-03-31 02-17-49](https://github.com/user-attachments/assets/35196b87-54eb-43a6-b183-b5715e44d5c8)

![Screenshot from 2025-03-31 02-18-06](https://github.com/user-attachments/assets/510539a4-879f-439a-9780-d99550247a5f)

#### Bubble Pop
![Screenshot from 2025-03-31 02-18-55](https://github.com/user-attachments/assets/0293829a-b9c7-47d9-826a-5237253ace2b)

#### Snake Game
![Screenshot from 2025-03-31 02-19-18](https://github.com/user-attachments/assets/62655e92-933f-41cf-850f-32e0d1fdebd4)

#### TicTacToe
![Screenshot from 2025-03-31 02-19-47](https://github.com/user-attachments/assets/5b167944-d19d-4cf6-b712-63bae44d4d0a)

#### Bucket Catch
![Screenshot from 2025-03-31 02-20-08](https://github.com/user-attachments/assets/d04903ea-a8bd-4f8e-9c4f-01aa78e86402)

#### Jigsaw Puzzle
![Screenshot from 2025-03-31 02-20-24](https://github.com/user-attachments/assets/fd7adba7-bc45-44ed-ac40-02fe66e8e682)


## Features  

- **Two Learning Modes:**  
  - **Practice Mode (Guided Tracing):** Helps learners trace Kannada letters with guided assistance.  
  - **Write Mode (Freehand Writing):** Evaluates handwritten characters using AI-powered recognition and provides corrective feedback.  

- **Letter Pronunciation & Haptics:**  
  - Each letter is accompanied by **audio pronunciation** to help children learn the correct sounds.  
  - **Haptic feedback** enhances engagement by providing tactile responses during tracing exercises.  

- **Thematic Learning Elements:**  
  - **Animal Illustrations:** Letters are paired with animals to make learning more engaging for children.  

- **Interactive Mini-Games (With Score Tracking):**  
  - **Bucket Catch:** Letters fall from the top, and the user must catch the correct ones in a bucket.  
  - **Tic-Tac-Toe (Kannada Letters):** A classic game adapted to reinforce letter recognition.  
  - **Jigsaw Puzzle:** Players piece together Kannada letters to complete the puzzle.  
  - **Snake Game:** The snake must eat only the correct target letter to grow, while incorrect choices reduce points.  
  - **Bubble Pop:** Users must pop bubbles containing the target letter while avoiding incorrect ones.  
  - **Previous Best Score Storage:** The highest score for each game is saved, allowing users to track their progress and try to beat their best performances.  

- **AI-Powered Evaluation:**  
  - A **Convolutional Neural Network (CNN)** analyzes freehand writing and assigns scores based on accuracy.  
  - Users are rated out of **three stars** for each letter attempt.  

- **Progress Tracking & Adaptive Learning:**  
  - Low-rated letters are **prioritized for additional practice** to reinforce learning.  

- **Secure Authentication:**  
  - **Google OAuth integration** allows seamless login while maintaining data privacy.  

## Environmental Variables

Create a `.env.local` file in the frontend directory with the following variables:

```env
MONGODB_URI=your_mongodb_uri            # MongoDB connection string
GOOGLE_CLIENT_ID=your_google_client_id  # OAuth client ID from Google Cloud Console
GOOGLE_CLIENT_SECRET=your_google_client_secret  # OAuth client secret
NEXTAUTH_URL=http://localhost:3000      # Your application URL
NEXTAUTH_SECRET=random_string           # Random string for NextAuth session
NEXT_PUBLIC_BACKEND_URL=fastapi_address # URL of the FastAPI Backend Server
```

## Getting Started

### Running the Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### Running the FastAPI Backend

```bash
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload
```

## Kannada Handwritten Alphabet Recognition Model

### Dataset and Preprocessing

- **Dataset:**  
  The dataset can be obtained from [IEEE Dataport](https://ieee-dataport.org/documents/kannada-language-image-dataset).

- **Image Processing:**  
  - Images are converted to grayscale and resized to 28×28 pixels.  
  - The dataset is split into training (80%) and validation (20%) sets.  
  - Labels are one-hot encoded using `tf.keras.utils.image_dataset_from_directory`.

- **Data Augmentation:**  
  - Applied to the training set to improve generalization.  
  - Techniques include random rotation, zoom, and translation using Keras' `Sequential` model.

### CNN Architecture

![CNN Architecture](https://github.com/user-attachments/assets/8427b259-3d2b-47be-8270-04bcfd536b11)


The model consists of three convolutional blocks:

#### **Block 1:**
- Two convolutional layers (32 filters, 3×3 kernel, ReLU activation) with batch normalization.
- Max pooling and dropout (25%).

#### **Block 2:**
- Two convolutional layers (64 filters, 3×3 kernel, ReLU activation) with batch normalization.
- Max pooling and dropout (25%).

#### **Block 3:**
- Two convolutional layers (128 filters, 3×3 kernel, ReLU activation) with batch normalization.
- Max pooling and dropout (25%).

#### **Final Layers:**
- Flattened output is passed through:
  - A dense layer with 128 neurons (ReLU activation), batch normalization, and dropout (50%).
  - A final dense layer with softmax activation to classify 49 Kannada characters.

### Model Training

- **Compilation:**
  - Optimizer: Adam  
  - Loss function: Categorical crossentropy  

- **Callbacks:**
  - Early stopping prevents overfitting if validation loss does not improve for five epochs.  
  - Learning rate reduction is applied when validation loss plateaus.  

- **Training Configuration:**
  - The model is trained for up to 480 epochs with early stopping enabled.  

- **Model Saving:**
  - The trained model is saved as `full_model.h5` for inference.

### Model Performance

- **Test Accuracy:** 98.45%
