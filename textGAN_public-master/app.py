import json
import itertools
import pandas as pd
from flask import Flask 
import initialize as initialize 
from flask import render_template,url_for
import story as st
from itertools import chain
from flask import Flask, render_template, request, redirect, Response, jsonify

app = Flask(__name__) 

pca_org = []
pca_rand = []
pca_strat = []


@app.route("/")
def index():
	return render_template("index_r.html")

list_of_stories = []
list_of_variables_copy = []
list_of_stories_jsons = []

@app.route("/stories")
def stories():
	global list_of_stories
	global list_of_variables_copy
	global list_of_stories_jsons
	list_of_variables_copy = []
	list_of_stories = []
	list_of_stories_jsons = []
	list_ids_selected = json.loads(request.args.get('key'))
	list_ids_selected_pairs = json.loads(request.args.get('key2'))	
	list_of_variables = list_ids_selected_pairs
	list_of_variables.sort()
	list_of_variables = list(k for k,_ in itertools.groupby(list_of_variables))
	
	print(list_of_variables)
	list_of_variables_copy = list_of_variables
	for variables in list_of_variables:
		if isinstance(variables,list):
			i = 0
			cor = st.get_correlation(variables[i],variables[i + 1])
			outliers = st.get_outliers(variables[i],variables[i + 1])
			out = st.get_extreme_outliers(outliers, variables[i] ,variables[i + 1])
			if not list_of_stories:
				temp = st.story(variables[i],variables[i + 1],out,cor)
				list_of_stories.append(st.opening_options() + temp[0])
				list_of_stories_jsons.append(temp[1])
			else:
				temp = st.story(variables[i],variables[i + 1],out,cor)
				list_of_stories.append(st.the_middle() + temp[0])
				list_of_stories_jsons.append(temp[1])
	return jsonify("Received")
	
	
@app.route("/stories_page")
def stories_page():
	#print("**********",list_of_stories_jsons)
	return render_template("index.html", d = {'jsons': list_of_stories_jsons, 'stories': list_of_stories, 'variables': list_of_variables_copy})

				
if __name__ == "__main__": 
	app.run(debug = True)
