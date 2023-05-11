from flask import Flask, Response, request, make_response,jsonify
import mediapipe as mp
import cv2
import pickle
import numpy as np
import pandas as pd
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import base64
from io import BytesIO
from PIL import Image
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///feedback.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)
with open('body_language.pkl', 'rb') as f:
        model = pickle.load(f)


@app.route('/process_video', methods=['POST'])

def gen():
   

   
    mp_drawing = mp.solutions.drawing_utils # Drawing helpers
    mp_holistic = mp.solutions.holistic # Mediapipe Solutions
    # Get image data from the client
    image_data1 =  request.json.get('frame')
    # print(image)
    # nparr = np.frombuffer(image_data, np.uint8)
    # frames = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    image_data = base64.b64decode(image_data1.split(',')[1])

    # Convert the data to a numpy array
    image_array = np.frombuffer(image_data, np.uint8)

    # Decode the image
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    
# Decode the data URL into binary image data
    # data = image_data.split(',')[1].encode('utf-8')
    # img_data1 = base64.decodebytes(data)

    # # Load the image data into a Pillow image object
    # image2 = Image.open(BytesIO(img_data1))

    # # Convert the Pillow image object into a numpy array that OpenCV can work with
    # image3 = np.array(image2)
        


    # Convert the base64-encoded data to a numpy array
    # img = decode_base64_image(image_data)
    
    # npimg = np.frombuffer(image_data.encode(), np.uint8)
    # image = cv2.imdecode(image3, cv2.IMREAD_COLOR)
    # processed_frames = []
# Initiate holistic model
    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        
        # while image.isOpened():
            # frame = image.read()
            # if not ret:
            #      print(image)
            #      break    
            # Recolor Feed
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False        
            # print(image)
            # print("done1")

            # Make Detections
            results = holistic.process(image)
            
            # Recolor image back to BGR for rendering
            image.flags.writeable = True   
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            
            # 1. Draw face landmarks
            mp_drawing.draw_landmarks(image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION, 
                                    mp_drawing.DrawingSpec(color=(80,110,10), thickness=1, circle_radius=1),
                                    mp_drawing.DrawingSpec(color=(80,256,121), thickness=1, circle_radius=1)
                                    )
            
            # 2. Right hand
            mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
                                    mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
                                    mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
                                    )

            # 3. Left Hand
            mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
                                    mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4),
                                    mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)
                                    )

            # 4. Pose Detections
            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS, 
                                    mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4),
                                    mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
                                    )
            # print(image)
            
            # Export coordinates
            
            # Extract Pose landmarks
            pose = results.pose_landmarks.landmark
            pose_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in pose]).flatten())
            
            # Extract Face landmarks
            face = results.face_landmarks.landmark
            face_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in face]).flatten())
            
            # Concate rows
            row = pose_row+face_row
            
                # Make Detections
            X = pd.DataFrame([row])
            body_language_class = model.predict(X)[0]
            body_language_prob = model.predict_proba(X)[0]
            # print(body_language_class, body_language_prob)
            
            # Grab ear coords
            coords = tuple(np.multiply(
                            np.array(
                                (results.pose_landmarks.landmark[mp_holistic.PoseLandmark.LEFT_EAR].x, 
                                results.pose_landmarks.landmark[mp_holistic.PoseLandmark.LEFT_EAR].y))
                        , [640,480]).astype(int))
            
            cv2.rectangle(image, 
                        (coords[0], coords[1]+5), 
                        (coords[0]+len(body_language_class)*20, coords[1]-30), 
                        (245, 117, 16), -1)
            cv2.putText(image, body_language_class, coords, 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
            
            # Get status box
            cv2.rectangle(image, (0,0), (250, 60), (245, 117, 16), -1)
            
            # Display Class
            cv2.putText(image, 'CLASS'
                        , (95,12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
            cv2.putText(image, body_language_class.split(' ')[0]
                        , (90,40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
            
            # Display Probability
            cv2.putText(image, 'PROB'
                        , (15,12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
            cv2.putText(image, str(round(body_language_prob[np.argmax(body_language_prob)],2))
                        , (10,40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
    
        
            # processed_video =  cv2.cvtColor(cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_COLOR), cv2.COLOR_BGR2GRAY)
            # _, encoded_image = cv2.imencode('.png', processed_video)
            # encoded_image = base64.b64encode(encoded_image).decode()
    # return the processed video frame as bytes
            # response = make_response(processed_video.tobytes())
            # response.headers.set('Content-Type', 'image/jpeg')
            # response.headers.set('Content-Disposition', 'attachment', filename='processed_video.jpg')
              
            _, buffer = cv2.imencode('.jpeg', image)
            processed_image_data = base64.b64encode(buffer).decode('utf-8')

            # Create a response object containing the processed image data
            response_data = {'processed_image': processed_image_data}
            response = jsonify(response_data)
            # print(image)

            # print("done2")


            return response
            # buffer = cv2.imencode('.jpg', image)
            # frame = buffer.tobytes()
            # yield the frame in byte format
            # yield (b'--frame\r\n'
            #        b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            


@app.route('/video')
def video_feed():
    return Response(gen())
                 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True, use_reloader=False)
