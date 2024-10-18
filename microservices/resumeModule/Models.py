from nltk.tokenize import word_tokenize
import nltk
from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
import torch
import numpy as np
import streamlit as st

# Mean Pooling - Take attention mask into account for correct averaging
# First element of model_output contains all token embeddings
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] 
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)


@st.cache_resource
def get_HF_embeddings(sentences):

  # Load model from HuggingFace Hub
  tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-mpnet-base-v2')
  model = AutoModel.from_pretrained('sentence-transformers/all-mpnet-base-v2')
  
  # Tokenize sentences
  encoded_input = tokenizer(sentences, padding=True, truncation=True, return_tensors='pt', max_length=512)
  
  # Compute token embeddings
  with torch.no_grad():
      model_output = model(**encoded_input)
      
  # Perform pooling. In this case, max pooling.
  embeddings = mean_pooling(model_output, encoded_input['attention_mask'])

  # print("Sentence embeddings:")
  # print(embeddings)
  return embeddings


def cosine(embeddings1, embeddings2):
    
  # get the match percentage
  score_list = []
  for i in embeddings1:
      matchPercentage = cosine_similarity(np.array(i), np.array(embeddings2))
      matchPercentage = np.round(matchPercentage, 4)*100 # round to two decimal
      #print("Your resume matches about" + str(matchPercentage[0])+ "% of the job description.")
      score_list.append(str(matchPercentage[0][0]))
  return score_list
