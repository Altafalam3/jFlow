const eeoFields = {
  gender: "Male",
  race: "Asian (Not Hispanic or Latino)",
  veteran: "I am not a veteran",
};


const fetchUserDetails = async (token) => {
  try {
    const response = await fetch("http://localhost:8800/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const resume = await fetch("http://localhost:8800/api/user/resume", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const resumeData = await resume.blob();
    let metadata = {
      type: "application/pdf",
    };
    data.user.resume = new File([resumeData], "resume.pdf", metadata);
    return data?.user;
  } catch (err) {
    console.log(err);
  }
};


const setField = (values, field, fieldKey) => {
  const isURL = fieldKey.toLowerCase().includes("url");
  if (isURL) {
    values?.urls?.forEach((url, index) => {
      const urlFieldType = fieldKey.toLowerCase();
      if (urlFieldType.includes(url?.type.toLowerCase())) {
        field.value = url.url;
        const event = new TouchEvent("touchstart", {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        field.dispatchEvent(event);
        field.blur();
        // Scroll the field into view
        setTimeout(() => {
          field.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 1000);
      }
    });
    return;
  }
  console.log(fieldKey);
  Object.keys(values)?.forEach((name) => {
    const filteredName = name.replace(/_/g, "").toLowerCase();
    if (fieldKey.replace(/\s/g, "").toLowerCase().includes(filteredName)) {
      field.value = values[name];
      const event = new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      field.dispatchEvent(event);
      field.blur();
      // Scroll the field into view
      setTimeout(() => {
        field.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 1000);
    }
  });
};


const uploadFile = (field, file) => {
  const dt = new DataTransfer();
  dt.items.add(file);
  field.files = dt.files;
  const event = new Event("change", {
    bubbles: !0,
  });
  field.dispatchEvent(event);
};


const getJobDescription = () => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "getTabUrl" }, async (response) => {
      try {
        const tabUrl = response;
        const urlStripped = tabUrl.split("/");
        urlStripped.pop();
        jobUrl = urlStripped.join("/");
        const res = await (await fetch(jobUrl)).text();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = res;
        const jobDescription = tempDiv.querySelector(
          "[data-qa='job-description']"
        );
        resolve(jobDescription.textContent);
      } catch (e) {
        reject(e);
      }
    });
  });
};


const autoFillCustomAnswer = async (
  jobDescription,
  applicationQuestion,
  token
) => {
  const response = await fetch("http://localhost:8800/api/llama/custom-answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      jobDescription,
      applicationQuestion,
    }),
  });
  const data = await response.json();
  return data;
};

const autoFillMatchPercentage = async (jobDescription, token) => {
  const response = await fetch("http://localhost:8800/api/llama/match-percentage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jobDescription }),
  });
  const data = await response.json();
  return data; // Expected to be of the form { matchPercentage: <number> }
};

// Updated helper: recursively check for an element with the ".text" selector
function getDeepText(element) {
  // First, check if the element itself or any of its descendants matches ".text"
  const textEl = element.querySelector(".text");
  if (textEl) {
    return textEl.textContent.trim();
  }
  // If not, then check if there's a first child to recurse into
  if (element.firstElementChild) {
    return getDeepText(element.firstElementChild);
  }
  // Fallback: return the textContent of the current element
  return element.textContent.trim();
}

const displayMatchPercentage = async (token) => {
  try {
    const jobDescription = await getJobDescription();
    const matchResult = await autoFillMatchPercentage(jobDescription, token);
    console.log("Match percentage:", matchResult);
    // Create an element to display the match percentage
    const matchDiv = document.createElement("div");
    matchDiv.className = "match-percentage";
    matchDiv.style.cssText =
      "background: #e2f7e2; padding: 10px; margin: 10px; border: 1px solid #0a0; font-size: 16px; text-align: center;";
    matchDiv.textContent = `Match Percentage: ${matchResult.matchPercentage}%`;
    
    // Find the target container
    const headerDiv = document.querySelector("div.section.page-centered.posting-header");
    if (headerDiv) {
      headerDiv.appendChild(matchDiv);
    } else {
      console.warn("Target container not found; appending to body.");
      document.body.appendChild(matchDiv);
    }
  } catch (e) {
    console.error("Error displaying match percentage:", e);
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fillInputFields") {
    const token = message.data;
    fetchUserDetails(token).then((data) => {
      const values = data;
      const nameField = document.querySelector("input[name='name']");
      if (nameField) {
        nameField.value = `${values.first_name} ${values.last_name}`;
      }
      const inputFields = Array.from(
        document.querySelectorAll(
          "input[type=text], input[type=email], input[type=tel], input[type=number], input[type=date], input[type=file]"
        )
      );

      // for file processing
      inputFields?.forEach((field) => {
        // Find the field by name
        if (field.name) {
          try {
            if (field.type === "file") {
              uploadFile(field, values[field.name] || null);
              console.log("add delay 10 sec");
            }
          } catch (e) {
            console.log(e);
          }
        } else if (field.id) {
          // Find the field by id
          try {
            const label = document.querySelector(`label[for=${field.id}]`)?.textContent;
            if (field.type === "file" && label.toLowerCase() === "resume") {
              uploadFile(field, values.resume || null);
              console.log("add delay 10 sec");
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
      
      // // for fields processing
      // inputFields?.forEach((field) => {
      //   // Find the field by name
      //   if (field.name) {
      //     try {
      //       if (field.type !== "file") {
      //         setField(values, field, field.name);
      //       }
      //     } catch (e) {
      //       console.log(e);
      //     }
      //   } else if (field.id) {
      //     // Find the field by id
      //     try {
      //       const label = document.querySelector(`label[for=${field.id}]`)?.textContent;
      //       if (field.type !== "file" && label.toLowerCase() === "name" || label.toLowerCase() === "full name") {
      //         field.value = `${values.first_name} ${values.last_name}`;
      //       } else if(field.type !== "file") {
      //         setField(values, field, label);
      //       }
      //     } catch (e) {
      //       console.log(e);
      //     }
      //   }
      // });
      
      setTimeout(() => {
        inputFields?.forEach((field) => {
          // Process non-file fields
          if (field.name) {
            try {
              if (field.type !== "file") {
                setField(values, field, field.name);
              }
            } catch (e) {
              console.log(e);
            }
          } else if (field.id) {
            try {
              const label = document.querySelector(`label[for=${field.id}]`)?.textContent;
              if (field.type !== "file" && (label.toLowerCase() === "name" || label.toLowerCase() === "full name")) {
                field.value = `${values.first_name} ${values.last_name}`;
              } else if (field.type !== "file") {
                setField(values, field, label);
              }
            } catch (e) {
              console.log(e);
            }
          }
        });
      }, 10000);
      

      const textAreas = Array.from(document.querySelectorAll("textarea"));
      console.log("Textareas found:", textAreas);
      textAreas?.forEach((field) => {
        try {
          // Try to find a label, fallback to parentElement or even the field itself
          let container = field.closest("label") || field.parentElement || field;
          const btn = document.createElement("button");
          btn.textContent = "Fill";
          btn.className = "textarea-fill-btn";
          btn.style.cssText =
            "background: #36789c; color: white; padding: 10px 24px; border: none; cursor: pointer; border-radius: 5px; margin: 10px 0;";

          btn.addEventListener("click", async (e) => {
            e.preventDefault();
            btn.textContent = "Filling...";
            const containerText = container.textContent || "";
            // 1. Try to get the application question from the textarea's placeholder.

            const placeholderText = field.getAttribute("placeholder") || "";

            // 2. If not found, try to get it from a preceding sibling element.
            let applicationQuestion = placeholderText + containerText; // adjust as needed
            console.log(applicationQuestion)
            if (!placeholderText) {
              // Try to locate a container2 that holds the question text.
              // For the first sample, the textarea is inside a container2 with class "application-field"
              // and its preceding sibling (with class "application-label") holds the question.
              let container2 = field.parentElement;
              let container3 = field.parentElement.parentElement || field;
              let deeptext = "";
              if (container3) {
                deeptext = getDeepText(container3);
              }
              if (!deeptext && container2) {
                deeptext = getDeepText(container2);
              }
              applicationQuestion += deeptext;

            }

            const jobDescription = await getJobDescription();
            console.log("Job description:", jobDescription);
            const ans = await autoFillCustomAnswer(jobDescription, applicationQuestion, token);
            field.value = ans;
            btn.textContent = "Filled";
          });

          container.appendChild(btn);
          console.log("Appended fill button to:", container);
        } catch (e) {
          console.log(e);
        }
      });

      // Display match percentage at the top of the page
      displayMatchPercentage(token);

      // Finally, send a response indicating the process is complete
      sendResponse({ message: "Fields filled" });
    }).catch((error) => {
      console.error(error);
      sendResponse({ error: "Error fetching user details" });
    });
    // Return true to indicate sendResponse will be called asynchronously.
    return true;
  }
  // For other messages, immediately send a response.
  sendResponse({ message: "Received" });
});
