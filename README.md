# Archi Management Tool

## Introduction

**Archi Management Tool** is an open-source project aimed at providing a solution to easily **parse and export information from ArchiMate models** created using the [ArchiMate Tool](https://www.archimatetool.com). The purpose of this tool is to help users of the ArchiMate modeling language manage and explore their designs more efficiently by parsing the exported XML files and identifying the elements within them.

This project allows users to upload ArchiMate XML files, visualize the hierarchical structure, and explore the detailed properties of each element in the model.

## Features

- **Upload ArchiMate XML Files**: The user can upload a design created with the ArchiMate Tool in XML format.
- **Parse ArchiMate Elements**: The tool parses the uploaded XML document and identifies the elements within the model, displaying them in a tree structure.
- **Visualize Model Structure**: The hierarchical structure of the ArchiMate model is displayed, helping users navigate through folders and elements.
- **View Element Details**: Once a user selects an element, the detailed properties (such as attributes and inner content) are displayed in a dedicated panel.
- **Export Potential**: The initial goal is to facilitate the future development of an **export feature** to transform ArchiMate model data into various formats for further analysis and documentation.

## Motivation

This project was created to fill a gap in the current ArchiMate tool ecosystem, allowing for easier **data extraction** and **exploration** of ArchiMate models. The main motivation behind the tool is to:

- Provide a user-friendly way to parse and identify key elements in ArchiMate XML exports.
- Simplify the management of complex enterprise architectures designed in ArchiMate.
- Enable future **exporting** capabilities for transforming model data into formats like JSON, CSV, or other business analysis tools.

## How It Works

### Parsing the XML Document

The tool uses the browser's built-in `DOMParser` to parse the ArchiMate XML file provided by the user. When the user uploads the file:

1. The XML document is read using the `FileReader` API.
2. The tool parses the document and extracts key information such as folders and elements.
3. It then builds a tree structure from the parsed data, where each node corresponds to a folder or an element in the ArchiMate model.
4. The user can explore the structure by clicking on folders or elements to view detailed information such as their properties, attributes, and inner content.

### Identifying Elements

- The XML structure exported from ArchiMate contains nested folders and elements representing the different components of the architecture model.
- The tool processes each folder and its children recursively, ensuring that all elements (like business processes, actors, applications, etc.) are captured.
- Each element's attributes (e.g., `name`, `id`, etc.) are extracted and displayed in the details panel when the element is selected.
- This hierarchical representation allows users to **navigate** through their models in a more intuitive manner, making it easier to find specific elements.

### Example Process:

1. **Upload XML File**:
   - The user is prompted to upload an XML file exported from ArchiMate.
2. **Parse the File**:
   - The XML is parsed using the `DOMParser` and structured into folders and elements.
3. **Display the Structure**:
   - A tree panel on the left side displays the hierarchical structure of the model.
4. **View Element Details**:
   - When the user clicks on an element, detailed information about that element (its properties and inner content) is displayed in the central panel.

## Usage

### Prerequisites

To use **Archi Management Tool**, you need:

- A modern web browser (such as Chrome, Firefox, or Edge) that supports JavaScript and file reading APIs.
- An ArchiMate model exported as an XML file from [ArchiMate Tool](https://www.archimatetool.com).

### Instructions

1. Clone or download the project to your local machine:

   ```bash
   git clone https://github.com/miguelcespedes/archi-management-tool.git
2. Open the `index.html` file in your browser.

3. Follow these steps:
   - A modal will prompt you to upload an ArchiMate XML file.
   - Browse and select the file.
   - Once the file is loaded, the model structure will appear in the left-hand tree view.
   - Click on any element to view its details in the central panel.

### Future Plans

This tool is a foundation for a more comprehensive ArchiMate management solution. Planned features include:

- **Export Capabilities**: Allow users to export parsed data into formats such as JSON or CSV.
- **Analysis Tools**: Add features to analyze ArchiMate models directly within the tool, such as impact analysis or dependency mapping.
- **Visualization Enhancements**: Integrate visual diagrams for a more graphical representation of the model's architecture.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests with improvements or new features.

### How to Contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Submit a pull request explaining your changes.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, modify, and distribute this software with attribution.

## Support

If you find this project useful and would like to support its continued development, feel free to:

**[Buy Me a Coffee](https://www.buymeacoffee.com/miguelcespedes)** ☕

Your support helps maintain and enhance this open-source project. Thank you!

## Author

Developed by [Miguel Céspedes](https://github.com/miguelcespedes). If you find this project useful, feel free to support me by checking out my other projects or getting in touch.
