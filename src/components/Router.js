"use strict";

import {
  jobDetailsContentEl,
  BASE_API_URL,
  getData,
  state,
} from "../common.js";
import renderJobDetails from "./JobDetails.js";
import renderSpinner from "./Spinner.js";
import renderError from "./Error.js";
import renderJobList from "./JobList.js";

// Function to get the job ID from the URL hash
const getJobIdFromHash = () => {
  return window.location.hash.substring(1);
};

// Function to remove the active class from all job items
const removeActiveClassFromJobItems = () => {
  document
    .querySelectorAll(".job-item--active")
    .forEach((jobItemWithActiveClass) =>
      jobItemWithActiveClass.classList.remove("job-item--active")
    );
};

// Function to clear job details content
const clearJobDetailsContent = () => {
  jobDetailsContentEl.innerHTML = "";
};

// Function to handle fetching job details and updating the state
const fetchJobDetailsAndUpdateState = async (id) => {
  try {
    const data = await getData(`${BASE_API_URL}/jobs/${id}`);
    const { jobItem } = data;

    // Update state with the fetched job item
    state.activeJobItem = jobItem;

    // Render the job list and job details
    renderJobList();
    renderJobDetails(jobItem);
  } catch (error) {
    renderError(error.message);
  } finally {
    // Always remove the spinner after fetching data
    renderSpinner("job-details");
  }
};

// Function to handle hash change and load events
const loadHashChangeHandler = async () => {
  const id = getJobIdFromHash();

  if (id) {
    removeActiveClassFromJobItems();
    clearJobDetailsContent();
    renderSpinner("job-details");

    await fetchJobDetailsAndUpdateState(id);
  }
};

// Add event listeners for DOMContentLoaded and hashchange events
window.addEventListener("DOMContentLoaded", loadHashChangeHandler);
window.addEventListener("hashchange", loadHashChangeHandler);
