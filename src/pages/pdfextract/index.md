---
id: PdfExtract
title: Pdf Extract
sidebar_label: Pdf Extract
---

import PdfToDxfDownloadButton from "../../components/PdfToDxfDownloadButton";

# 📄 Pdf Extract QGIS Plugin

The **Pdf Extract** is a QGIS plugin that extracts vector data and text from PDF files and converts them to multiple vector formats including DXF, Shapefile, and GeoJSON. It uses PyMuPDF (fitz) to read PDF content and ezdxf to generate DXF files. The plugin supports multi-page PDFs and offers options to extract geometry and text separately, making it suitable for converting PDF maps or drawings into editable GIS layers.

## ✨ Features

- **Vector Conversion**: Converts PDF vector graphics (lines, curves, polygons) into editable vector formats including DXF, Shapefile, and GeoJSON.

- **Text Extraction**: Extracts text from PDF files and converts them into DXF `MTEXT` entities or vector text layers in Shapefile/GeoJSON, preserving position and size.

- **Layer Separation**: Automatically organizes output into distinct layers or files:

  - Geometry layers contain vector shapes (lines, curves, rectangles).

  - Text layers contain all text elements (labels and annotations).

- **Multi-page Support**: Handles multi-page PDFs by generating separate files for each page and content type. For example:

  - `output_p1_geom.dxf` / `.shp` / `.geojson` for page 1 geometry

  - `output_p1_text.dxf` / `.shp` / `.geojson` for page 1 text

- **Output Formats**: Supports exporting to DXF, Shapefile, and GeoJSON formats.

- **Automated Loading**: Option to automatically load the generated output files into the current QGIS project.

## ⚙️ Installation

### Prerequisites

The plugin relies on two Python libraries:

- `pymupdf` (fitz)

- `ezdxf`

## Installing the Plugin

Download the plugin zip file (`PdfExtract.zip`). <PdfToDxfDownloadButton />

### Method 1

1. Open **OSGeo4W Shell** by running the `OSGeo4W.bat` file located in your QGIS installation directory (typically `C:\Program Files\QGIS 3.xx\OSGeo4W.bat` or similar, depending on your QGIS version and installation path).
2. Run the following command:

    ```bash
    pip install pymupdf "ezdxf<1.1"
    ```

    or (if above fails to activate the plugin try)

    ```bash
    pip install pymupdf "ezdxf"
    ```

3. Open QGIS.

4. Go to **Plugins** > **Manage and Install Plugins...**.

5. Select **Install from Zip**.

6. Browse to the `PdfExtract.zip` file and click **Install Plugin**.

### Method 2

The plugin includes a dependency check mechanism. If dependencies are missing, it will prompt you to install them. You can install them manually using the **OSGeo4W Shell**:

1. Open QGIS.

2. Go to **Plugins** > **Manage and Install Plugins...**.

3. Select **Install from Zip**.

4. Browse to the `PdfExtract.zip` file and click **Install Plugin**.

5. Restart the QGIS and follow the on screen instructions to install the missing dependencies. Close QGIS.

6. Open QGIS again.

## 🧭 Usage Guide

### 💬 Using the Dialog Interface

1. Open the **Pdf Extract** dialog from the QGIS main window via toolbar or menu.

2. In the **Input** tab:
    - Click `Browse...` to select the PDF file.

    - Click `Browse...` to select the output folder.

    - Select the output format from the dropdown: Shapefile (.shp), GeoJSON (.geojson), or DXF (.dxf).

    - Optionally, check **Load results into QGIS** to load outputs automatically.

3. In the **Advanced** tab:
    - Choose to process **All pages** or specify a **Page Range** by entering the start and end page numbers. Selecting a page range allows you to convert only specific pages from the PDF.

    - Select the content to extract:

      - **Geometry**: Extracts vector shapes such as lines, curves, and rectangles from the PDF.

      - **Text**: Extracts text elements including labels and annotations.

      - **Both**: Extracts both geometry and text for comprehensive conversion.

4. Click **Convert** ▶️ to start processing.
    - The progress bar displays the current status.
    - A confirmation message appears upon completion showing how many layers were loaded.

### ⚙️ Running the Algorithm Directly

1. Open the QGIS Processing Toolbox.

2. Search for **Pdf Extract**.

3. Configure the algorithm parameters:
    - Input PDF file path.

    - Output format (Shapefile or GeoJSON or DXF).

    - Output base path.

    - Option to load output into the project.

4. Run the algorithm to process the PDF and generate vector output layers.

## 🐞 Troubleshooting

**"Missing dependencies"** Error

If you see an error about missing `pymupdf` or `ezdxf`, follow the **Installing Dependencies** section above. The plugin attempts to prompt for missing dependencies on startup.

### Text not appearing

- Ensure the PDF actually contains text objects and not just images of text. You can verify this by trying to select text in a PDF viewer.

- Check the `PDF_TEXT` layer or equivalent text layer in QGIS or your CAD software.

### Distorted Geometry or Missing Features

- The converter supports standard PDF vector commands. Complex clipping paths, transparency groups, or unusual drawing commands might be simplified or ignored.

- DXF output depends on `ezdxf` and its support capabilities.

### Output Files Not Found or Not Loading

- Check the output folder path and file naming.

- Confirm that the supported output formats are DXF, Shapefile, and GeoJSON.

- Ensure output layers are loaded if the "Load results into QGIS" option is enabled.

## 🕵️‍♂️ Technical Details

- **Coordinate System**: PDF coordinates have their origin at the top-left with Y axis increasing downward. The plugin transforms these to GIS-compatible coordinates by flipping the Y axis to origin at bottom-left.

- **Units**: The conversion preserves PDF point units (1/72 inch). Scale adjustments may be needed in QGIS based on your project's Coordinate Reference System (CRS).

- **Output File Naming**: For multi-page PDFs, separate output files are created per page and content type with names like:
  - `output_p1_geom.dxf` / `.shp` / `.geojson` — Geometry layer for page 1
  
  - `output_p1_text.dxf` / `.shp` / `.geojson` — Text layer for     page 1
  
- **Layer Separation**: The plugin creates separate layers for geometry (lines, curves, rectangles) and text (labels, annotations) to aid editing and styling in GIS software.

- **Supported Output Formats**: DXF (via ezdxf), Shapefile, and GeoJSON are supported as export formats.
