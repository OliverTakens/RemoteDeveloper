"use strict";

import {
  state,
  sortingEl,
  sortingBtnRecentEl,
  sortingBtnRelevantEl,
} from "../common.js";

import renderJobList from "./JobList.js";
import renderPaginationButtons from "./Pagination.js";

// Function to get the clicked sorting button
const getClickedButton = (e) => {
  return e.target.closest(".sorting__button");
};

// Function to update sorting buttons' appearance
const updateSortingButtonAppearance = (isRecent) => {
  if (isRecent) {
    sortingBtnRecentEl.classList.add("sorting__button--active");
    sortingBtnRelevantEl.classList.remove("sorting__button--active");
  } else {
    sortingBtnRecentEl.classList.remove("sorting__button--active");
    sortingBtnRelevantEl.classList.add("sorting__button--active");
  }
};

// Function to sort job items based on the selected criteria
const sortJobItems = (isRecent) => {
  if (isRecent) {
    state.searchJobItems.sort((a, b) => a.daysAgo - b.daysAgo);
  } else {
    state.searchJobItems.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
};

// Click handler for sorting buttons
const clickHandler = (e) => {
  const clickedButtonEl = getClickedButton(e);

  // Stop function if no button was clicked
  if (!clickedButtonEl) return;

  // Reset to page 1
  state.currentPage = 1;

  // Determine if sorting by recent or relevant
  const isRecent = clickedButtonEl.className.includes("--recent");

  // Update sorting button appearance
  updateSortingButtonAppearance(isRecent);

  // Sort job items
  sortJobItems(isRecent);

  // Render pagination buttons and job list
  renderPaginationButtons();
  renderJobList();
};

// Add event listener for sorting buttons
sortingEl.addEventListener("click", clickHandler);
