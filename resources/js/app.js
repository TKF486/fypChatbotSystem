/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require("./bootstrap");

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require("./components/QuestionModal");
require("./components/QuestionList");
require("./components/NavBar");
require("./components/QuestionCategory");
require("./components/PieChart");
require("./components/Dashboard");

// resources/assets/js/app.js

import $ from "jquery";
window.$ = window.jQuery = $;

import "jquery-ui/ui/widgets/datepicker.js";
//add as many widget as you may need
