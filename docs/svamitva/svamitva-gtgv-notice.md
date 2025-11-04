# How to Generate Svamitva GT & GV Notices

This guide will walk you through the process of generating Svamitva Ground Truthing (GT) and Ground Validation (GV) Notices using the Surveyor Stories Notice Generator application.

## Prerequisites

- You have access to the Surveyor Stories Notice Generator web application.
- You have the required CSV or Excel data file containing land records (with columns such as Assessment Number, Property Parcel Number, Pattadar Name, etc.).
- You know the relevant details for your mandal, panchayat, and notification.

---

## Required and Optional Data Fields

Before uploading your CSV, ensure your data includes the following fields:

### Required Fields

These fields **must** be present in your CSV and mapped during the column mapping step:

- **Assessment Number** (`అసెస్మెంట్ నంబర్`)
- **Property Parcel Number** (`ప్రాపర్టీ పార్సెల్ నంబర్`)
- **Pattadar Name** (`భూ యజమాని పేరు`)
- **Relation Name** (`భర్త/తండ్రి పేరు`)

### Optional Fields

These fields are optional, but if present in your CSV, you can map them for richer notices:

- **Mobile Number** (`మొబైల్ నెంబరు`)

---

## Watch the Tutorial

---

## Step 1: Open the Svamitva GT & GV Notice Generator

1. Navigate to the [Svamitva GT & GV Notice Generator](../../svamitva/svamitva_gtgvnotice) page in your browser.

---

## Step 2: Fill in Notice Details

On the main form, fill in the following fields:

- **Mandal Name:** Enter or select the mandal in Telugu.
- **Panchayat Name:** Enter or select the panchayat in Telugu.
- **Start Date:** Choose the date when the ground truthing/validation will begin.
- **Start Time:** Enter the time when the process will start.
- **6(1) Notification Number:** Enter the official 6(1) notification number.
- **6(1) Notification Date:** Enter the date of the 6(1) notification.
- **Notice Printed Date:** Enter the date the notice is being generated/printed.
- **Notice Type:**
  Select the type of notice you want to generate.
  - For Ground Truthing, ensure **"GT Notice"** is selected.
  - For Ground Validation, ensure **"GV Notice"** is selected.
- **Notice Mode:**
  Choose how you want to group the notices.
  - **Assessment Number wise:** Group notices by Assessment Number (default for most use cases).
  - **Property Parcel Number wise:** Group notices by Property Parcel Number.
  - **Owner Name wise:** Group notices by Pattadar Name.
  - **Mobile Number wise:** Group notices by Mobile Number.
  - Select the mode that matches your reporting or distribution requirements.
- **Panchayat Secretary Name:** Enter the name of the Panchayat Secretary in Telugu.
- **Form Number:** Select the form number (Form 7 for GT, Form 15 for GV) or enter a custom form number.

---

## Step 3: Upload CSV or Excel Data

1. Click the **Upload CSV or Excel File** button in the form section.
2. Select your CSV or Excel file containing the land records.
3. After uploading, a toast notification will confirm the upload and display the number of rows loaded.

---

## Step 4: Map CSV Columns

1. The application will prompt you to map the columns from your CSV file to the required fields (e.g., Assessment Number, Property Parcel Number, Pattadar Name, etc.).
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

- Ensure your CSV or Excel file has clear headers and consistent data for best results.
- If you change the **Notice Type**, the form number will reset to the default for that type.
- You can generate notices grouped by Assessment Number, Property Parcel Number, Owner Name, or Mobile Number by selecting the appropriate **Notice Mode**.

---

## Troubleshooting

- **File Upload Issues:** Make sure your CSV or Excel file is properly formatted and contains all required columns.
- **Mapping Errors:** Double-check that each required field is mapped to the correct CSV column.
- **Preview Not Showing:** Ensure you have completed the mapping step and that your data is valid.
- **Printing/Download Issues:** If the print or download does not work, try refreshing the page or using a different browser.

---

## Support

If you encounter any issues or have questions, please contact the Surveyor Stories support team or refer to the [Feedback and reporting](../../resurvey/feedback) section.

---

Happy Notice Generating!
