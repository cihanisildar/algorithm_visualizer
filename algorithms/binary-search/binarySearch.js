// /algorithms/binary-search/binarySearch.js
class BinarySearchVisualizer {
            constructor() {
                this.array = [];
                this.steps = [];
                this.currentStep = -1;
                this.target = null;
                this.found = false;

                this.arrayContainer = document.getElementById("arrayContainer");
                this.searchInput = document.getElementById("searchInput");
                this.searchBtn = document.getElementById("searchBtn");
                this.nextBtn = document.getElementById("nextBtn");
                this.resetBtn = document.getElementById("resetBtn");
                this.status = document.getElementById("status");
                this.metrics = document.getElementById("metrics");
                this.stepsCount = document.getElementById("stepsCount");
                this.searchAnalysis = document.getElementById("searchAnalysis");

                this.initializeArray();
                this.setupEventListeners();
            }

            initializeArray() {
                this.array = Array.from(
                    { length: 15 },
                    () => Math.floor(Math.random() * 100) + 1
                ).sort((a, b) => a - b);
                this.renderArray();
                this.resetSearch();
            }

            resetSearch() {
                this.steps = [];
                this.currentStep = -1;
                this.target = null;
                this.found = false;
                this.nextBtn.disabled = true;
                this.status.textContent = "Ready to search...";
                this.metrics.style.display = "none";
                this.searchAnalysis.innerHTML = "";
                this.renderArray();
            }

            setupEventListeners() {
                this.searchBtn.addEventListener("click", () => this.startSearch());
                this.nextBtn.addEventListener("click", () => this.showNextStep());
                this.resetBtn.addEventListener("click", () => {
                    this.initializeArray();
                    this.resetSearch();
                });
            }

            renderArray(left = -1, right = -1, mid = -1) {
                this.arrayContainer.innerHTML = "";

                this.array.forEach((num, idx) => {
                    const bar = document.createElement("div");
                    bar.className = "array-bar";
                    const height = (num / 100) * 280 + 20;
                    bar.style.height = `${height}px`;
                    bar.textContent = num;

                    if (idx === mid) {
                        bar.className += " current";
                    } else if (idx >= left && idx <= right) {
                        bar.className += " range";
                    }

                    this.arrayContainer.appendChild(bar);
                });
            }

            startSearch() {
                const searchValue = parseInt(this.searchInput.value);
                if (isNaN(searchValue) || searchValue < 1 || searchValue > 100) {
                    alert("Please enter a valid number between 1 and 100");
                    return;
                }

                this.target = searchValue;
                this.generateSteps();
                this.currentStep = -1;
                this.nextBtn.disabled = false;
                this.metrics.style.display = "grid";
                this.status.textContent = `Searching for ${this.target}...`;
                this.searchAnalysis.innerHTML = "";
                this.renderArray();
            }

            generateSteps() {
                this.steps = [];
                let left = 0;
                let right = this.array.length - 1;

                while (left <= right) {
                    const mid = Math.floor((left + right) / 2);
                    this.steps.push({
                        left,
                        right,
                        mid,
                        midValue: this.array[mid],
                        comparison:
                            this.array[mid] === this.target
                                ? "equal"
                                : this.array[mid] < this.target
                                    ? "less"
                                    : "greater",
                    });

                    if (this.array[mid] === this.target) {
                        this.found = true;
                        break;
                    }
                    if (this.array[mid] < this.target) {
                        left = mid + 1;
                    } else {
                        right = mid - 1;
                    }
                }
            }

            showNextStep() {
                this.currentStep++;

                if (this.currentStep >= this.steps.length) {
                    this.nextBtn.disabled = true;
                    this.status.textContent = this.found
                        ? `Found ${this.target}!`
                        : `${this.target} not found in the array.`;
                    this.showFinalAnalysis();
                    return;
                }

                const step = this.steps[this.currentStep];
                this.renderArray(step.left, step.right, step.mid);
                this.stepsCount.textContent = this.currentStep + 1;

                let explanation = `Step ${this.currentStep + 1}: `;
                explanation += `Checking middle element ${step.midValue} at position ${step.mid}. `;

                if (step.comparison === "equal") {
                    explanation += `Found the target value ${this.target}!`;
                } else if (step.comparison === "less") {
                    explanation += `${step.midValue} is less than ${this.target}, so searching in the right half.`;
                } else {
                    explanation += `${step.midValue} is greater than ${this.target}, so searching in the left half.`;
                }

                this.status.textContent = explanation;
            }

            showFinalAnalysis() {
                this.searchAnalysis.innerHTML = `
                    <h3>Search Analysis</h3>
                    <ul>
                        <li>Initial array size: ${this.array.length} elements</li>
                        <li>Steps taken: ${this.steps.length}</li>
                        <li>Theoretical maximum steps: ${Math.ceil(Math.log2(this.array.length))}</li>
                        <li>Time Complexity: O(log n) - logarithmic time</li>
                        <li>Space Complexity: O(1) - constant space</li>
                    </ul>
                    <p><strong>Explanation:</strong> Binary search has a logarithmic time complexity because it divides the search space in half with each step. 
                    For an array of ${this.array.length} elements, it will never take more than ${Math.ceil(Math.log2(this.array.length))} steps to find any element or determine it doesn't exist.</p>
                `;
            }
        }

const visualizer = new BinarySearchVisualizer();
