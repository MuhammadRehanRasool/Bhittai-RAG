# **AMBILE Shah Jo Risalo**

**Developed by:**  
Abdul Majid Bhurgri Institute of Language Engineering (AMBILE), Hyderabad  
Under the administrative control of the **Culture, Tourism, Antiquities & Archives Department, Government of Sindh**

## **Dataset Overview**  
The "Shah Jo Risalo" dataset serves as a comprehensive linguistic and literary resource, encompassing **4,767 Sindhi poetic verses** drawn from the **30 traditional Surs** (sections) of the esteemed magnum opus of **Shah Abdul Latif Bhittai**. Each poetic verse, written in **Sindhi Arabic Perso**, is meticulously paired with its **Roman Script**, **Devanagri Script**, along with translations in **Sindhi**, **English** (translated by *Amar Fayaz Buriro*), **Urdu** (translated by *Agha Saleem*), and **Punjabi** (translated by *Kartar Singh Arsh*). This dataset offers valuable insights into the philosophical, spiritual, and cultural dimensions embedded within the poetry, making it an indispensable asset for researchers, linguists, educators, and developers working on Sindhi literature and AI/NLP applications.

## **Dataset Features**
- **Total Verses**: 4,767 poetic lines from **30 classical Surs**
- **Language**: Clean **Sindhi script** in **Unicode format**
- **File Format**: CSV file titled `Bhittaipedia Risalo -(25-08-25).csv`

## **CSV Structure**
The dataset is organized into the following fields:
- **Row_ID**: Unique identifier for each row
- **Melody Number**: Identifier for the melody associated with the verse
- **Melody (سر)**: Name of the Sur (chapter)
- **Chapter Number**: Verse number within the Sur
- **Chapter (داستان)**: Subsection within the Sur
- **Type**: Type or category of the verse
- **Bait / Vaayi Number**: Number associated with the poetic form
- **Sindhi Arabic Perso**: Original Sindhi poetic verse
- **Roman Script**: Sindhi verse in Roman script
- **Devanagri Script**: Sindhi verse in Devanagri script
- **Explanation**: Sindhi interpretation of the verse
- **English Translation**: Translated by *Amar Fayaz Buriro*
- **Urdu Translation**: Translated by *Agha Saleem*
- **Punjabi Translation**: Translated by *Kartar Singh Arsh*
- **Keywords**: Search-optimized terms for easier data retrieval

## **Applications**
This dataset is a valuable resource for a variety of applications, including but not limited to:
- **Natural Language Processing (NLP)** research in Sindhi language
- Development of **AI-powered Sindhi chatbots** and conversational agents
- Creation of **educational tools** for literature learning
- **Text-to-Speech (TTS)** system training
- **Verse classification** and **sentiment analysis** projects
- **Digital preservation** and promotion of Sindhi literary heritage

## **Data Source**
The dataset is sourced from the **AMBILE Bhittaipedia project**, which aims to digitize and preserve the cultural heritage of Sindhi literature.

## **How to Use**
1. **Clone the repository or download the CSV file**.
2. Open the CSV file using **Python** or **Excel**:
python
import pandas as pd
df = pd.read_csv("Bhittaipedia Risalo -(25-08-25).csv")
print(df.head())

## Data Source
The dataset is sourced from the [AMBILE Bhittaipedia project](https://bhittaipedia.org/sur-kalyan/d-1/1).

## License:
This dataset is released under the **Creative Commons Attribution-NonCommercial 4.0 License**. It is intended for educational and research purposes only.

## Acknowledgments:
Special thanks to the [**AMBILE team**](https://bhittaipedia.org/p/bhittai-pedia-team) for their involvement in data compilation and cleaning.


## Contact:
For any queries, collaboration opportunities, or contributions, please contact:
- **Email**: [datasets@sindh.ai](mailto:datasets@sindh.ai)
