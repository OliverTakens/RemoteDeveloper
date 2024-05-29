"use strict";

import {
  BASE_API_URL,
  RESULTS_PER_PAGE,
  state,
  jobListSearchEl,
  jobListBookmarksEl,
  jobDetailsContentEl,
  getData,
} from "../common.js";
import renderSpinner from "./Spinner.js";
import renderJobDetails from "./JobDetails.js";
import renderError from "./Error.js";

// Function to get the correct job list element based on the context (search or bookmarks)
const getJobListElement = (whichJobList) => {
  return whichJobList === "search" ? jobListSearchEl : jobListBookmarksEl;
};

// Function to get the job items to render based on the context (search or bookmarks)
const getJobItems = (whichJobList) => {
  if (whichJobList === "search") {
    return state.searchJobItems.slice(
      state.currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
      state.currentPage * RESULTS_PER_PAGE
    );
  } else if (whichJobList === "bookmarks") {
    return state.bookmarkJobItems;
  }
};

// Function to generate the HTML for a job item
const generateJobItemHTML = (jobItem) => {
  return `
    <li class="job-item ${
      state.activeJobItem.id === jobItem.id ? "job-item--active" : ""
    }">
      <a class="job-item__link" href="${jobItem.id}">
        <div class="job-item__badge">${jobItem.badgeLetters}</div>
        <div class="job-item__middle">
          <h3 class="third-heading">${jobItem.title}</h3>
          <p class="job-item__company">${jobItem.company}</p>
          <div class="job-item__extras">
            <p class="job-item__extra"><i class="fa-solid fa-clock job-item__extra-icon"></i> ${
              jobItem.duration
            }</p>
            <p class="job-item__extra"><i class="fa-solid fa-money-bill job-item__extra-icon"></i> ${
              jobItem.salary
            }</p>
            <p class="job-item__extra"><i class="fa-solid fa-location-dot job-item__extra-icon"></i> ${
              jobItem.location
            }</p>
          </div>
        </div>
        <div class="job-item__right">
          <i class="fa-solid fa-bookmark job-item__bookmark-icon ${
            state.bookmarkJobItems.some(
              (bookmarkJobItem) => bookmarkJobItem.id === jobItem.id
            )
              ? "job-item__bookmark-icon--bookmarked"
              : ""
          }"></i>
          <time class="job-item__time">${jobItem.daysAgo}d</time>
        </div>
      </a>
    </li>
  `;
};

// Function to render the job list based on the context (search or bookmarks)
const renderJobList = (whichJobList = "search") => {
  const jobListEl = getJobListElement(whichJobList);
  jobListEl.innerHTML = "";

  const jobItems = getJobItems(whichJobList);

  jobItems.forEach((jobItem) => {
    const newJobItemHTML = generateJobItemHTML(jobItem);
    jobListEl.insertAdjacentHTML("beforeend", newJobItemHTML);
  });
};

// Function to handle job item click events
const clickHandler = async (event) => {
  event.preventDefault();

  const jobItemEl = event.target.closest(".job-item");

  // Remove the active class from previously active job items
  document
    .querySelectorAll(".job-item--active")
    .forEach((jobItemWithActiveClass) =>
      jobItemWithActiveClass.classList.remove("job-item--active")
    );

  // Empty the job details section
  jobDetailsContentEl.innerHTML = "";

  // Render spinner
  renderSpinner("job-details");

  // Get the job item id
  const id = jobItemEl.children[0].getAttribute("href");

  // Update state with the active job item
  const allJobItems = [...state.searchJobItems, ...state.bookmarkJobItems];
  state.activeJobItem = allJobItems.find((jobItem) => jobItem.id === +id);

  // Re-render the job list to reflect the active job item
  renderJobList();

  // Add id to URL
  history.pushState(null, "", `/#${id}`);

  try {
    // Fetch job item details from the API
    const data = await getData(`${BASE_API_URL}/jobs/${id}`);
    const { jobItem } = data;

    // Remove spinner and render job details
    renderSpinner("job-details");
    renderJobDetails(jobItem);
  } catch (error) {
    renderSpinner("job-details");
    renderError(error.message);
  }
};

// Add event listeners to the job lists for click events
jobListSearchEl.addEventListener("click", clickHandler);
jobListBookmarksEl.addEventListener("click", clickHandler);

export default renderJobList;
