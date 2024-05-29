"use strict";

import {
  state,
  bookmarksBtnEl,
  jobDetailsEl,
  jobListBookmarksEl,
} from "../common.js";

import renderJobList from "./JobList.js";

// Function to check if the click was on the bookmark button
const isBookmarkButtonClick = (target) => {
  return target.className.includes("bookmark");
};

// Function to update the bookmark state
const updateBookmarkState = () => {
  const { activeJobItem, bookmarkJobItems } = state;
  if (
    bookmarkJobItems.some(
      (bookmarkJobItem) => bookmarkJobItem.id === activeJobItem.id
    )
  ) {
    state.bookmarkJobItems = bookmarkJobItems.filter(
      (bookmarkJobItem) => bookmarkJobItem.id !== activeJobItem.id
    );
  } else {
    state.bookmarkJobItems.push(activeJobItem);
  }
};

// Function to save bookmarks to LocalStorage
const saveBookmarksToLocalStorage = () => {
  localStorage.setItem(
    "bookmarkJobItems",
    JSON.stringify(state.bookmarkJobItems)
  );
};

// Function to toggle the bookmark button icon
const toggleBookmarkButtonIcon = () => {
  document
    .querySelector(".job-info__bookmark-icon")
    .classList.toggle("job-info__bookmark-icon--bookmarked");
};

// Click handler for bookmark button
const clickHandler = (e) => {
  if (!isBookmarkButtonClick(e.target)) return;

  updateBookmarkState();
  saveBookmarksToLocalStorage();
  toggleBookmarkButtonIcon();
  renderJobList();
};

// Function to activate the bookmarks button
const activateBookmarksButton = () => {
  bookmarksBtnEl.classList.add("bookmarks-btn--active");
  jobListBookmarksEl.classList.add("job-list--visible");
};

// Function to deactivate the bookmarks button
const deactivateBookmarksButton = () => {
  bookmarksBtnEl.classList.remove("bookmarks-btn--active");
  jobListBookmarksEl.classList.remove("job-list--visible");
};

// Mouse enter handler for bookmarks button
const mouseEnterHandler = () => {
  activateBookmarksButton();
  renderJobList("bookmarks");
};

// Mouse leave handler for bookmarks job list
const mouseLeaveHandler = () => {
  deactivateBookmarksButton();
};

// Add event listeners
jobDetailsEl.addEventListener("click", clickHandler);
bookmarksBtnEl.addEventListener("mouseenter", mouseEnterHandler);
jobListBookmarksEl.addEventListener("mouseleave", mouseLeaveHandler);
