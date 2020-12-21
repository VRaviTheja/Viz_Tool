#Try except when using API's
import json
import math
import conceptNet as genTextConcept
import statistics
import pandas as pd
from flask import Flask 
from flask import render_template,url_for
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
from collections import Counter
from sklearn.preprocessing import LabelEncoder
import random
import matplotlib.pyplot as plt

correlations = pd.read_csv("results.csv",index_col=0)
player_df = pd.read_csv("player_data.csv")
all_data = pd.read_csv("fifa19/data.csv")
numcols = ['Likability','Composure','Vision','Aggression','Weight','Height','ShotPower','Balance','International Reputation','Age','Potential','Finishing','Dribbling', 'Acceleration','SprintSpeed', 'Agility',  'Stamina','Value','Wage']
catcols = ['Preferred Foot','Position','Body Type']
belong_to = ['Club','Nationality']

def get_correlation(var1,var2):
	return correlations.loc[var1][var2]

def label_encode(var1,var2):
	lb1 = LabelEncoder()
	lb2 = LabelEncoder()
	if var1 in catcols:
		player_df[var1] = lb1.fit_transform(player_df[var1].astype(str))
	if var2 in catcols:
		player_df[var2] = lb1.fit_transform(player_df[var2].astype(str))
	return lb1,lb2

def get_extreme_outliers(outliers,var1,var2):
	list_of_extremes = []
	max_dif = float('-inf')
	i = random.randint(0,len(outliers) - 1)
	out = outliers.iloc[i,:].values
	return out
	
#Most of the players have an agression of around and age of . But, interestingly,
#Suprisingly, Woah, there are some players with Contrast among the outliers.
def get_outliers(var1,var2):
	lb1,lb2 = label_encode(var1,var2)		
	sc1 = StandardScaler()
	sc2 = StandardScaler()
	my_data = player_df[[var1,var2]]
	model = DBSCAN(eps=0.2, min_samples = 20).fit(sc1.fit_transform(my_data.values))
	player_df["outlier"] = list(model.labels_)
	all_data["outlier"] = list(model.labels_)
	player_df["outlier"] = player_df["outlier"].apply(lambda x : 1 if x == -1 else 0)
	all_data["outlier"] = all_data["outlier"].apply(lambda x : 1 if x == -1 else 0)
	colors = list(player_df["outlier"])
	
	"""
	#Code for Scatter Plots
	plt.scatter(player_df[var1], player_df[var2], c = colors, marker='o')
	plt.xlabel(var1, fontsize=16)
	plt.ylabel(var2, fontsize=16)
	plt.title("Scatter Plot Showing "+ var1 + " vs " + var2)
	plt.show()
	"""
	
	outliers = my_data[player_df["outlier"] == 1]
	return outliers
#Keep it short if the story is big. 
#If small length then go for big ones.
def opening_options():
	op1 = "Hey there! Lets dive right into the data. "
	op2 = "This story is about Football players. "
	op3 = "These are the hidden eggs in your data. "
	op4 = "These are the interesting insights from your data. "
	op5 = "Hey there! Listen to this fascinating story. "
	op6 = "Hello there. "
	op7 = "Knowing the statistics about football players is really helpful. "
	answers = [op1,op2,op3,op4,op5,op6,op7]
	return answers[random.randint(0,6)]

#If numerical columns, then one intro, else another intro.
def get_mean_or_mode(var):
	if var in numcols:
		mymean = statistics.mean(player_df[var])
		numop5 =  " have an average " + str(math.ceil(mymean)) + " " + var
		numop6 =  " possess a mean " + str(math.ceil(mymean)) + " " + var
		numop3 =  " have a mean " + str(math.ceil(mymean)) + " " + var
		numop4 =  " possess an average " + str(math.ceil(mymean)) + " " + var
		numop2 =  " will have a mean " + str(math.ceil(mymean)) + " " + var
		numop1 =  " will have an average " + str(math.ceil(mymean)) + " " + var
		list_of_options = [numop1,numop2,numop3,numop4,numop5,numop6]
		numop1 = list_of_options[random.randint(0,5)]
	elif var in catcols:
		mymode = statistics.mode(player_df[var])
		numop1 = "have " + str(mymode) + " as the " + var
	else:
		mymode = statistics.mode(player_df[var])
		numop1 = "have an average " + str(mymode) + " " + var
	
	return numop1
	
def the_beginning():
	start6 = " Football is a game of perseverance. Did you know that many of the football players "
	start2 = " Many football players "
	start3 = " The First Football Game Was Played in 1869 Between Rutgers and Princeton.  Most of the football players "
	start4 = " American Football Evolved from Soccer and Rugby. Normally the football players you know "
	start5 = " The NFL Governs Professional Play in the United States. Normally Players "
	start1 = " The Pittsburgh Steelers Have the Most Super Bowl Wins. Many players who play football "
	list_of_options = [start1,start2,start3,start4,start5,start6]
	return list_of_options[random.randint(0,5)]
	
def the_middle():
	start1 = " Moreover, "
	start2 = " Also, "
	start3 = " In Addition, "
	start4 = " Continuing on. "
	start5 = " Whats more! . "
	start6 = " Now, that you heard all that! Let's hear some more. "
	list_of_options = [start1,start2,start3,start4,start5,start6]
	return list_of_options[random.randint(0,5)]

def making_it_personal(var1,var2):
	op2 = "get con"

def get_example():
	name = all_data[all_data["outlier"] == 1]["Name"]
	first = random.randint(0,int(len(name)/2) - 1)
	second = random.randint(int(len(name)/2),len(name) - 1)
	return list(name)[first],list(name)[second]

def outliers_get(var1,var2,out1,out2):
	start1 = " However, there are some players who even with " + str(out1) + " " + var1 + " have a suprising " + str(math.ceil(float(str(out2)))) + " " + var2 + "."
	start2 = " Anyway, there are some players who even with " + str(out1) + " " + var1 + " have " + str(math.ceil(float(str(out2)))) + " " + var2 + "."
	start3 = " You would be suprised to know this. There are some players who even with " + str(out1) + " " + var1 + " have " + str(math.ceil(float(str(out2)))) + " " + var2 + "."
	start4 = " But, there are some odd players with " + str(out1) + " " + var1 + " that have a suprising " + str(math.ceil(float(str(out2)))) + " " + var2 + "."
	start5 = " Here however, there are some players who even with " + str(out1) + " " + var1 + " have a suprising " + str(math.ceil(float(str(out2)))) + " " + var2 + "."
	list_of_options = [start1,start2,start3,start4,start5]
	return list_of_options[random.randint(0,4)]	
	
def story(var1,var2,out,cor):
	story_dict = {}
	story_dict["average"] = the_beginning() + get_mean_or_mode(var1) + " and " + get_mean_or_mode(var2) + "." 
	sentence1 = the_beginning() + get_mean_or_mode(var1) + " and " + get_mean_or_mode(var2) + "."
	outliers = outliers_get(var1,var2,out[0],out[1])
	first,second = get_example()
	example_1  = " For example, " + first + " and " + second + " belong to that category."
	example_2 = " Case in point, " + first + " and " + second + " are the odd ones out."
	example_3 = " For instance, " + first + " and " + second + " are some of the outliers."
	example_4 =  "   Strange right?  " + first + " and " + second + " are some of the outliers."
	example_5 =  "   Strange right?  " + first + " and " + second + " belong to that category."
	lop = [example_1,example_2,example_3,example_4,example_5]
	example = lop[random.randint(0,4)]
	if cor > 0:
		opt_1 = " Whats more interesting is as " + var1 + " increases " + var2 + " increases."
		opt_2 = " Observe that as " + var1 + " decreases " + var2 + " decreases."
		opt_3 = " As you can see from the above graph, as "+ var1 + " increases " + var2 + " increases."
		opt_4 = " As you can see from the above graph, as " + var1 + " decreases " + var2 + " decreases."
	else:
		opt_1 = " Whats more interesting is as " + var1 + " increases " + var2 + " decreases."
		opt_2 = " Observe that as " + var1 + " decreases " + var2 + " increases."
		opt_3 = " As you can see from the above graph, as "+ var1 + " increases " + var2 + " decreases."
		opt_4 = " As you can see from the above graph, as " + var1 + " decreases " + var2 + " increases."

	corr = [opt_1, opt_2, opt_3, opt_4][random.randint(0,3)]
	story_dict["outliers"] = outliers + example
	story_dict["corr"] = corr
	return (sentence1 + outliers + example + corr, story_dict)
	

#get_outliers("Balance","Stamina")	

