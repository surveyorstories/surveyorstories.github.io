# How to Generate a Ground Truthing Notice

This guide will walk you through the process of generating a Ground Truthing (GT) Notice using the Surveyor Stories Notice Generator application.

## Prerequisites

- You have access to the Surveyor Stories Notice Generator web application.
- You have the required CSV data file containing land records (with columns such as Khata No, Survey No, Pattadar Name, etc.).
- You know the relevant details for your district, mandal, village, and notification.

---

## Required and Optional Data Fields

Before uploading your CSV, ensure your data includes the following fields:

### Required Fields

These fields **must** be present in your CSV and mapped during the column mapping step:

- **Survey No** (`సర్వే నెం`)
- **Khata No** (`ఖాతా సంఖ్య`)
- **Pattadar Name** (`భూ యజమాని పేరు`)
- **Relation Name** (`భర్త/తండ్రి పేరు`)

### Optional Fields

These fields are optional, but if present in your CSV, you can map them for richer notices:

- **Mobile Number** (`మొబైల్ నెంబరు`)

---
## Watch the Tutorial

<div align="center">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/hoXqG4xB-gQ" 
    title="9(2) Notice Generation Tutorial" frameborder="0" allowfullscreen></iframe>
</div>

---

## Step 1: Open the Notice Generator

1. Navigate to the [Resurvey Notice Generator](../../resurvey/groundtruthingnotice) page in your browser.

---

## Step 2: Fill in Notice Details

On the main form, fill in the following fields:

- **District Name:** Select the district from the dropdown.
- **Mandal Name:** Enter or select the mandal.
- **Village Name:** Enter or select the village.
- **Start Date:** Choose the date when the ground truthing will begin.
- **Start Time:** Enter the time when the process will start.
- **Notification Number:** Enter the official notification number.
- **Notification Date:** Enter the date of the notification.
- **Printed Date:** Enter the date the notice is being generated/printed.
- **Notice Type:**  
  Select the type of notice you want to generate.  
  - For Ground Truthing, ensure **"GT Notice"** is selected.  
  - Other types (such as "GV Notice") may be available for different workflows.
- **Notice Mode:**  
  Choose how you want to group the notices.  
  - **Khata:** Group notices by Khata number (default for most use cases).
  - **Survey:** Group notices by Survey number.
  - **Khata wise (Pattadar Name once):** Show Pattadar Name only once per Khata group.
  - Select the mode that matches your reporting or distribution requirements.
- **Officer Name:** Enter the name of the responsible officer.
- **Officer Designation:** Select the officer's designation from the dropdown.
- **Form Number:** Enter the form number if required (defaults are provided and may change based on Notice Type).

---

## Step 3: Upload CSV Data

1. Click the **Upload CSV** button in the form section.
2. Select your CSV file containing the land records.
3. After uploading, a toast notification will confirm the upload and display the number of rows loaded.

---

## Step 4: Map CSV Columns

1. The application will prompt you to map the columns from your CSV file to the required fields (e.g., Khata No, Survey No, Pattadar Name, etc.).
2. For each required field, select the corresponding column from your CSV.
3. Click **Submit Mapping** when done.
4. A toast notification will confirm that the mapping is complete and a preview will be generated.

---

## Step 5: Preview the Notices

- The **Preview** section will display the generated notices based on your input and uploaded data.
- Review the notices for accuracy.
- If you need to make changes, you can go back and adjust the form fields or re-upload your CSV.

---

## Step 6: Print or Download Notices

- To print the notices, click the **Print** button (printer icon) in the bottom-right corner of the preview section.
- To download the notices as a Word document, click the **Download Word** button in the preview section.

---

## Tips

- Ensure your CSV file has clear headers and consistent data for best results.
- If you change the **Notice Type**, the form number will reset to the default for that type.
- You can generate notices grouped by Khata, Survey, or other modes by selecting the appropriate **Notice Mode**.

---

## Troubleshooting

- **CSV Upload Issues:** Make sure your CSV file is properly formatted and contains all required columns.
- **Mapping Errors:** Double-check that each required field is mapped to the correct CSV column.
- **Preview Not Showing:** Ensure you have completed the mapping step and that your data is valid.
- **Printing/Download Issues:** If the print or download does not work, try refreshing the page or using a different browser.

---

## Support

If you encounter any issues or have questions, please contact the Surveyor Stories support team or refer to the [Feedback and reporting](../../resurvey/feedback) section.

---

Happy Notice Generating!