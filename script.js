// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwDCXA8hZqNlngaMzft-aK33IVgEHSb0c",
  authDomain: "diet-recommendation-f8b0d.firebaseapp.com",
  projectId: "diet-recommendation-f8b0d",
  storageBucket: "diet-recommendation-f8b0d.appspot.com",
  messagingSenderId: "758952897849",
  appId: "1:758952897849:web:38e3fb293f9ca437ce4ce8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Ensure DOM is Loaded
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded Successfully!"); // Debugging

    // Attach event listener to button
    document.getElementById("calculateBtn").addEventListener("click", function () {
        console.log("Calculate Button Clicked!"); // Debugging
        calculateDiet();
    });
});

function calculateDiet() {
    // Get input values
    let age = parseInt(document.getElementById('age').value);
    let height = parseFloat(document.getElementById('height').value);
    let weight = parseFloat(document.getElementById('weight').value);
    let gender = document.getElementById('gender').value;
    let activity = parseFloat(document.getElementById('activity').value);
    let goal = parseFloat(document.getElementById('goal').value);
    let meals = parseInt(document.getElementById('meals').value);

    console.log("Input Values:", { age, height, weight, gender, activity, goal, meals });

    // Validate inputs
    if (isNaN(age) || isNaN(height) || isNaN(weight) || isNaN(activity) || isNaN(goal) || isNaN(meals)) {
        document.getElementById('results').innerHTML = '<p style="color:red;">Please fill in all fields.</p>';
        console.log("Validation Failed: Some fields are empty.");
        return;
    }

    // **BMI Calculation**
    let heightMeters = height / 100;
    let bmi = weight / (heightMeters * heightMeters);
    let bmiCategory = getBMICategory(bmi);

    // **BMR Calculation**
    let bmr = (gender === 'male')
        ? (10 * weight) + (6.25 * height) - (5 * age) + 5
        : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    // **Total Calories Needed**
    let dailyCalories = (bmr * activity) - goal;
    let mealCalories = dailyCalories / meals;

    console.log("Calculated BMI:", bmi.toFixed(1));
    console.log("Calories Needed:", dailyCalories.toFixed(0));

    // **Display Results**
    document.getElementById('results').innerHTML = `
        <p><strong>Your BMI:</strong> ${bmi.toFixed(1)} (${bmiCategory})</p>
        <p><strong>Daily Calorie Intake:</strong> ${dailyCalories.toFixed(0)} kcal</p>
        <p>For ${meals} meals per day, each meal should be around <strong>${mealCalories.toFixed(0)} calories</strong>.</p>
        <p><strong>Meal Plan Suggestion:</strong> Balanced meals with protein, carbs, and healthy fats.</p>
    `;

    // **Save Data to Firebase**
    saveUserData(age, height, weight, gender, activity, goal, meals, bmi, bmiCategory, dailyCalories);
}

// Function to Get BMI Category
function getBMICategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Normal weight";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    return "Obese";
}

// Function to Save User Data to Firebase Firestore
async function saveUserData(age, height, weight, gender, activity, goal, meals, bmi, bmiCategory, dailyCalories) {
    try {
        await addDoc(collection(db, "users"), {
            age: age,
            height: height,
            weight: weight,
            gender: gender,
            activity: activity,
            goal: goal,
            meals: meals,
            bmi: bmi.toFixed(1),
            bmiCategory: bmiCategory,
            dailyCalories: dailyCalories.toFixed(0),
            timestamp: new Date()
        });
        console.log("User data saved successfully!");
    } catch (error) {
        console.error("Error saving data:", error);
    }
}
