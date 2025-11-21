---
id: pdftodxf
title: PDF to DXF Converter
sidebar_label: PDF to DXF
---

import PdfToDxfDownloadButton from "../../components/PdfToDxfDownloadButton";

# PDF to DXF Converter QGIS Plugin

The **PDF to DXF Converter** is a QGIS plugin that converts PDF files to DXF format. It uses PyMuPDF (fitz) to read PDF content and ezdxf to generate DXF files. The plugin extracts vector geometry (lines, curves, rectangles) and text from PDF pages, making it useful for converting scanned or vector-based PDFs into CAD-compatible DXF files.

## Features

- **Vector Conversion**: Converts PDF vector graphics (lines, curves, polygons) into DXF geometries.

- **Text Extraction**: Extracts text from PDF files and converts them into DXF `MTEXT` entities, preserving position and size.

- **Layer Separation**: Automatically organizes output into distinct layers:

  - `PDF_GEOMETRY`: Contains all vector shapes (White/Black color).

  - `PDF_TEXT`: Contains all text elements (Red color).

- **Multi-page Support**: Handles multi-page PDFs by generating separate DXF files for each page (e.g., `output_page_1.dxf`, `output_page_2.dxf`).

- **Automated Loading**: Option to automatically load the generated DXF files into the current QGIS project.

## Installation

### Prerequisites

The plugin relies on two Python libraries:

- `pymupdf` (fitz)

- `ezdxf`

## Installing the Plugin

Download the plugin zip file (`PDFtoDXF.zip`). <PdfToDxfDownloadButton />

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

6. Browse to the `PDFtoDXF.zip` file and click **Install Plugin**.

### Method 2

The plugin includes a dependency check mechanism. If dependencies are missing, it will prompt you to install them. You can install them manually using the **OSGeo4W Shell**:

1. Open QGIS.

2. Go to **Plugins** > **Manage and Install Plugins...**.

3. Select **Install from Zip**.

4. Browse to the `PDFtoDXF.zip` file and click **Install Plugin**.

5. Restart the QGIS and Follow the on screen instructions to install the missing Dependencies. Close the QGIS.

6. Open the QGIS again.

## Usage Guide

1. **Open the Tool**:
    - Go to the **Processing Toolbox** panel (usually on the right).

    - Expand the **Bhukamatha-lite** group.

    - Double-click on **PDF to DXF Converter**.

2. **Configure Parameters**:
    - **Input PDF**: Click the `...` button to select the PDF file you want to convert.

    - **Output DXF**: Click the `...` button to choose where to save the generated DXF file.

    - **Load output into project**: Check this box if you want the result to be added to your map canvas immediately.

3. **Run Conversion**:
    - Click **Run**.

    - The log window will show the progress.

    - Once finished, you will see a success message indicating how many files were generated.

## Troubleshooting

**"Missing dependencies"** Error

If you see an error about missing `pymupdf` or `ezdxf`, follow the **Installing Dependencies** section above.

### Text not appearing

- Ensure the PDF actually contains text objects and not just images of text. You can verify this by trying to select text in a PDF viewer.

- Check the `PDF_TEXT` layer in QGIS or your CAD software.

### Distorted Geometry

- The converter handles standard PDF vector commands. Complex clipping paths or transparency groups might be simplified or ignored.

## Technical Details

- **Coordinate System**: PDF coordinates (origin at top-left) are transformed to DXF coordinates (origin at bottom-left) by flipping the Y-axis.

- **Units**: The conversion preserves the PDF point units (1/72 inch). You may need to scale the result in QGIS depending on your project's CRS.
