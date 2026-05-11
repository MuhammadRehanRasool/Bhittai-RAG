# Bhittai RAG: Neural Retrieval and Semantic Analysis of Shah Jo Risalo

Bhittai RAG is a small, practical RAG project for Shah Abdul Latif Bhittai's Risalo. It turns the raw dataset into a clean JSON format, builds a FAISS index over the verses, and lets you search for relevant context with Roman Sindhi queries.

## What this project does

1. Cleans and reshapes the raw CSV dataset.
2. Exports a structured JSON file for retrieval.
3. Creates a FAISS vector index for semantic search.
4. Tests retrieval quality with a small benchmark.

## Project Files

- [dataset_formatter.ipynb](dataset_formatter.ipynb) prepares the dataset and writes `formatted_dataset/risalo.json`.
- [RAG.ipynb](RAG.ipynb) loads the JSON, creates embeddings, builds `risalo_index.faiss`, and runs retrieval examples.
- [formatted_dataset/risalo.json](formatted_dataset/risalo.json) is the cleaned output used for search.
- [risalo_index.faiss](risalo_index.faiss) is the saved vector index.
- [retrieval_benchmark.csv](retrieval_benchmark.csv) stores evaluation results.

## How the pipeline works

### 1. Format the dataset

The formatter notebook reads `base_dataset/risalo.csv`, removes columns that are not needed, drops rows without Roman Script, and exports a smaller JSON structure.

Example record shape:

```json
{
	"id": 1,
	"metadata": {
		"melody": "سُر ڪاموڏ",
		"chapter": "...",
		"type": "..."
	},
	"content": {
		"roman_text": "...",
		"explanation": "...",
		"english_translation": "..."
	},
	"searchable_text": "..."
}
```

### 2. Build the RAG index

The RAG notebook loads the formatted JSON, normalizes Roman Sindhi text, expands important query themes such as Noori, Marui, Sassui, Sohni, and Karbala, then embeds the text with a multilingual SentenceTransformer model.

### 3. Search the verses

The `search_risalo()` helper returns structured matches instead of a generated answer. That makes it useful for downstream apps, demos, and evaluation.

## Examples

```python
search_risalo("Keenjhar jo kinaro ain Noori")
```

```python
search_risalo("Malir ain Marui ji galh")
```

```python
search_risalo("Karbala ain Imam Hussain")
```

Each query returns:

- the original user query
- the processed query used for retrieval
- FAISS distances
- the top matching verses with melody, verse text, and explanation

## Example workflow

```python
import json

with open("formatted_dataset/risalo.json", "r", encoding="utf-8") as f:
		data = json.load(f)

context = search_risalo("Sacha ishq bare mein chah chayo aahe?")
print(json.dumps(context, indent=2, ensure_ascii=False))
```

## Useful outputs

- `formatted_dataset/risalo.json` for clean structured data
- `risalo_index.faiss` for fast similarity search
- `retrieval_benchmark.csv` for simple retrieval scoring

## Evaluation & results
Based on a small benchmark of 50 queries covering key themes, the current retrieval setup achieves for each query the following accuracy scores (where "accuracy @K" means the correct verse was in the top K results):

- Accuracy @1: 9.80%
- Accuracy @3: 13.73%
- Accuracy @5: 23.53%
- Accuracy @10: 27.45%

These scores reflect the current retrieval setup. Important areas to improve accuracy are word preprocessing and handling misspellings in Roman Sindhi — both are actively flagged in the notebooks and are expected to raise accuracy when improved.

Short-term improvements to try:

- Expand the normalization map in `preprocess_roman_sindhi` to cover more variants.
- Use fuzzy matching or edit-distance-aware embeddings for noisy Roman-script input.
- Increase synonym coverage in `expand_query` and add phrase-level expansions.

## Notebook helpers & symbols

You can find two helpers used by the notebooks:

- `preprocess_roman_sindhi` — normalization and simple spelling fixes for Roman Sindhi.

	Example inputs → outputs (demonstrates what the function actually does):

    - "ishq" might be misspelled as "ishk" or "ishaq"
    - "chayo" might be misspelled as "chayyo" or "chaayo"
    - "ayen" might be misspelled as "ain" or "ayen"
    - "muhnja" might be misspelled as "munja" or "muhnjaa"

- `expand_query` — theme/synonym expansion to increase recall for named themes (Noori, Sassui, Marui, etc.).

	Example:

	- Input: `"Noori"`
	- Output: `"Noori Jam Tamachi Keenjhar Kamod Fisherwoman Lake Humility Lowly-born King-Jam-Tamachi Gandri | noori"` (the notebook then lowercases/normalizes this string when you run the combined pipeline)

Combined usage example (as used in the notebooks):

- `preprocess_roman_sindhi(expand_query("Noori"))` → a lowercased, punctuation-free, and normalized query string such as:

	`"noori jam tamachi keenjhar kamod fisherwoman lake humility lowlyborn kingjamtamachi gandri noori"`

	Note: the exact normalized output depends on the normalization-map rules; the key point is that `expand_query` increases recall by adding related tokens, and `preprocess_roman_sindhi` cleans and normalizes them before embedding/search.

## Query language & tips

Roman Sindhi (Latin script) is highly inconsistent and not easily parsed by standard tokenizers, spellings and transliteration vary a lot. To improve retrieval this project applies simple normalization and query-expansion, but the following guidelines help get the best results:

- **Roman Sindhi (recommended):** short keyword queries work well once normalized. Example: `Keenjhar jo kinaro ain Noori`
- **English:** use English keywords or short descriptions when easier. Example: `love and separation in Risalo`
- **Sindhi (Arabic script):** will also work as our explanation is in Arabic script.

Tips:

- Prefer short keywords or theme words (Noori, Sassui, Marui, Karbala).
- Combine languages if unsure (e.g. `Noori | Noori Jam Tamachi`) to increase recall.
- Use the `search_risalo()` examples in the notebooks as copy-paste queries to reproduce results.

## Notes

The notebooks are written to be lightweight and easy to inspect. You can run them from top to bottom to recreate the formatted dataset and the search index.

With <3 by Rehan Sathio(https://rehansathio.dev) for Sindhi Community!
