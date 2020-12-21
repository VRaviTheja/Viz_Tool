import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import markovify #Markov Chain Generator

inp = pd.read_csv('input.csv')
inp.head(3)