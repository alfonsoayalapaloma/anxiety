from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/mouse_data', methods=['POST'])
def mouse_data():
    data = request.json
    movements = data['movements']
    
    # Analyze movements to infer anxiety levels
    speed_threshold_alert = 5  # Example threshold for alert level
    speed_threshold_super_anxious = 6  # Example threshold for super-anxious level
    anxiety_level = 0

    for i in range(1, len(movements)):
        x1, y1, t1 = movements[i-1]
        x2, y2, t2 = movements[i]
        distance = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
        time_elapsed = t2 - t1
        if time_elapsed > 0:
            speed = distance / time_elapsed
            print(speed)
            if speed > speed_threshold_super_anxious:
                anxiety_level = 3  # Super-anxious
                break
            elif speed > speed_threshold_alert:
                anxiety_level = 2  # Alert
            else:
                anxiety_level = 1  # Calm

    response = {'anxiety_level': anxiety_level}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
