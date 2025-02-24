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
    console.log("JavaScript Loaded Successfully!");
    document.getElementById("calculateBtn").addEventListener("click", function () {
        console.log("Calculate Button Clicked!");
        calculateDiet();
    });

    // ✅ Add Menu Button Dynamically
    let menuButton = document.createElement("button");
    menuButton.innerText = "☰ Menu";
    menuButton.id = "menuBtn";
    menuButton.style.position = "absolute";
    menuButton.style.top = "10px";
    menuButton.style.left = "10px";
    menuButton.style.padding = "10px";
    menuButton.style.fontSize = "18px";
    menuButton.style.cursor = "pointer";
    document.body.appendChild(menuButton);

    // ✅ Toggle Sidebar Visibility
    menuButton.addEventListener("click", function () {
        let sidebar = document.getElementById("sidebar");
        if (sidebar.style.display === "none" || sidebar.style.display === "") {
            sidebar.style.display = "block";
        } else {
            sidebar.style.display = "none";
        }
    });
});

function calculateDiet() {
    let age = parseInt(document.getElementById('age').value);
    let height = parseFloat(document.getElementById('height').value);
    let weight = parseFloat(document.getElementById('weight').value);
    let gender = document.getElementById('gender').value;
    let activity = parseFloat(document.getElementById('activity').value);
    let goal = parseFloat(document.getElementById('goal').value);
    let meals = parseInt(document.getElementById('meals').value);

    if (isNaN(age) || isNaN(height) || isNaN(weight) || isNaN(activity) || isNaN(goal) || isNaN(meals)) {
        document.getElementById('results').innerHTML = '<p style="color:red;">Please fill in all fields.</p>';
        return;
    }

    let heightMeters = height / 100;
    let bmi = weight / (heightMeters * heightMeters);
    let bmiCategory = getBMICategory(bmi);

    let bmr = (gender === 'male')
        ? (10 * weight) + (6.25 * height) - (5 * age) + 5
        : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    let dailyCalories = (bmr * activity) - goal;
    let mealCalories = dailyCalories / meals;
    let mealPlan = getMealPlan(goal);

    document.getElementById('results').innerHTML = `
        <p><strong>Your BMI:</strong> ${bmi.toFixed(1)} (${bmiCategory})</p>
        <p><strong>Daily Calorie Intake:</strong> ${dailyCalories.toFixed(0)} kcal</p>
        <p>For ${meals} meals per day, each meal should be around <strong>${mealCalories.toFixed(0)} calories</strong>.</p>
        <p><strong>Meal Plan Suggestion:</strong></p>
        <ul>${mealPlan}</ul>
    `;

    saveUserData(age, height, weight, gender, activity, goal, meals, bmi, bmiCategory, dailyCalories);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Normal weight";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    return "Obese";
}

function getMealPlan(goal) {
    if (goal > 0) {
        return `
            <li>Breakfast: Scrambled eggs, whole wheat toast, avocado</li>
            <li>Lunch: Grilled chicken, brown rice, steamed vegetables</li>
            <li>Dinner: Salmon, quinoa, mixed greens</li>
            <li>Snacks: Greek yogurt, nuts, banana</li>
        `;
    } else if (goal < 0) {
        return `
            <li>Breakfast: Oatmeal with berries and almonds</li>
            <li>Lunch: Grilled tofu salad with vinaigrette</li>
            <li>Dinner: Stir-fried vegetables with lean protein</li>
            <li>Snacks: Carrot sticks, hummus, apple slices</li>
        `;
    } else {
        return `
            <li>Breakfast: Whole grain cereal with milk and a fruit</li>
            <li>Lunch: Turkey sandwich on whole wheat bread with salad</li>
            <li>Dinner: Baked chicken with sweet potatoes and greens</li>
            <li>Snacks: Cheese cubes, nuts, a protein bar</li>
        `;
    }
}

async function saveUserData(age, height, weight, gender, activity, goal, meals, bmi, bmiCategory, dailyCalories) {
    try {
        await addDoc(collection(db, "users"), {
            age, height, weight, gender, activity, goal, meals, bmi: bmi.toFixed(1), bmiCategory, dailyCalories: dailyCalories.toFixed(0), timestamp: new Date()
        });
        console.log("User data saved successfully!");
    } catch (error) {
        console.error("Error saving data:", error);
    }
}
