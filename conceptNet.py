import requests
import random

def get_information(query):
	try:
		query = query.strip().lower()
		obj = requests.get('http://api.conceptnet.io/c/en/' + query).json()
		list_of_answers = []
		for each_dict in obj["edges"]:
			surface_text = each_dict["surfaceText"]
			if surface_text is not None:
				surface_text = surface_text.replace("[","").replace("]","")
				list_of_answers.append(surface_text)
			else:
				temp = each_dict["end"]["label"]
				rel = each_dict["rel"]["label"]
				if query.lower() not in temp.lower():
					myanswer = query + " " + rel + " " + temp
					myanswer = myanswer.replace("Synonym"," is also known as ").replace("IsA", " is a ")
					list_of_answers.append(myanswer)
		n = len(list_of_answers)
		return "Interesting fact: " + list_of_answers[random.randint(0,n-1)]
	except:
		return ""

#print(get_information("india"))
