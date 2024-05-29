"use strict";

import {
  state,
  paginationEl,
  paginationNumberBackEl,
  paginationNumberNextEl,
  paginationBtnBackEl,
  paginationBtnNextEl,
  RESULTS_PER_PAGE,
} from "../common.js";

import renderJobList from "./JobList.js";

// Function to display or hide the back button
const toggleBackButton = () => {
  if (state.currentPage >= 2) {
    paginationBtnBackEl.classList.remove("pagination__button--hidden");
  } else {
    paginationBtnBackEl.classList.add("pagination__button--hidden");
  }
};

// Function to display or hide the next button
const toggleNextButton = () => {
  if (state.searchJobItems.length - state.currentPage * RESULTS_PER_PAGE <= 0) {
    paginationBtnNextEl.classList.add("pagination__button--hidden");
  } else {
    paginationBtnNextEl.classList.remove("pagination__button--hidden");
  }
};

// Function to update the page numbers
const updatePageNumbers = () => {
  paginationNumberNextEl.textContent = state.currentPage + 1;
  paginationNumberBackEl.textContent = state.currentPage - 1;
};

// Function to unfocus pagination buttons
const unfocusButtons = () => {
  paginationBtnNextEl.blur();
  paginationBtnBackEl.blur();
};

// Function to render pagination buttons
const renderPaginationButtons = () => {
  toggleBackButton();
  toggleNextButton();
  updatePageNumbers();
  unfocusButtons();
};

// Function to handle pagination button click
const clickHandler = (e) => {
  const clickedButtonEl = e.target.closest(".pagination__button");

  // Stop if no button was clicked
  if (!clickedButtonEl) return;

  // Determine if the next or back button was clicked
  const isNextPage = clickedButtonEl.className.includes("--next");

  // Update the current page state
  state.currentPage += isNextPage ? 1 : -1;

  // Render pagination buttons and job list for the new page
  renderPaginationButtons();
  renderJobList();
};

// Add event listener for pagination buttons
paginationEl.addEventListener("click", clickHandler);

export default renderPaginationButtons;
