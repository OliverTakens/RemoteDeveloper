"use strict";

import {
  searchInputEl,
  searchFormEl,
  jobListSearchEl,
  numberEl,
  BASE_API_URL,
  getData,
  state,
  sortingBtnRecentEl,
  sortingBtnRelevantEl,
} from "../common.js";

import renderError from "./Error.js";
import renderSpinner from "./Spinner.js";
import renderJobList from "./JobList.js";
import renderPaginationButtons from "./Pagination.js";

// Function to validate the search text
const validateSearchText = (text) => {
  const forbiddenPattern = /[0-9]/;
  return forbiddenPattern.test(text);
};

// Function to reset the sorting buttons
const resetSortingButtons = () => {
  sortingBtnRecentEl.classList.remove("sorting__button--active");
  sortingBtnRelevantEl.classList.add("sorting__button--active");
};

// Function to render the search results
const renderSearchResults = (jobItems) => {
  // Update state
  state.searchJobItems = jobItems;
  state.currentPage = 1;

  // Display number of results
  numberEl.textContent = jobItems.length;

  // Reset pagination and render job list
  renderPaginationButtons();
  renderJobList();
};

// Handler function for the search form submission
const submitHandler = async (event) => {
  // Prevent default form submission behavior
  event.preventDefault();

  // Get the search text from the input element
  const searchText = searchInputEl.value;

  // Validate the search text
  if (validateSearchText(searchText)) {
    renderError("Your search should not contain numbers");
    return;
  }

  // Remove focus from the input element
  searchInputEl.blur();

  // Clear previous job items
  jobListSearchEl.innerHTML = "";

  // Reset sorting buttons to default state
  resetSortingButtons();

  // Display spinner while fetching data
  renderSpinner("search");

  try {
    // Fetch search results from the API
    const data = await getData(`${BASE_API_URL}/jobs?search=${searchText}`);

    // Remove the spinner after fetching data
    renderSpinner("search");

    // Render the fetched job items
    renderSearchResults(data.jobItems);
  } catch (error) {
    // Remove the spinner and display an error message if the fetch fails
    renderSpinner("search");
    renderError(error.message);
  }
};

// Add event listener to the search form
searchFormEl.addEventListener("submit", submitHandler);
