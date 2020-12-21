#Importing necessary libraries
import copy
import numpy as np
import pandas as pd
from sklearn import decomposition
from sklearn.manifold import MDS
from scipy.stats import norm
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn import preprocessing
from sklearn.preprocessing import StandardScaler

#Returns Variances Using Principal Component Analysis.
def explain_variance(sample):
    # Initialize instance of StandardScaler
    pca = PCA().fit(sample)
    percent_variance = np.round(pca.explained_variance_ratio_* 100, decimals = 2)
    return percent_variance

#Elbow graph
def elbow_graph_kmeans(data_scaled):
	#Stratified sampling performed using K- Means
	ssd = []
	for k in range(1,15):
		km = KMeans(n_clusters = k, random_state=0).fit(data_scaled)
		ssd.append(km.inertia_)
	plt.plot(ssd)    

def scale_data(df_all):
	# Initialize an instance of StandardScaler
	scaler = MinMaxScaler()
	# Fit and transform data
	data_scaled = scaler.fit_transform(df_all)
	return data_scaled

def random_and_stratified_sampling(num_clusters,data_scaled,df_all):
	#Finalized K means
	km = KMeans(n_clusters = num_clusters, random_state = 0).fit(data_scaled)
	predict_cluster = km.predict(data_scaled)
	df_all['cluster'] = pd.Series(predict_cluster, index = df_all.index)
	#Stratified Clustering
	group = df_all.groupby('cluster')
	concat_samples = []
	#Stratified Sampling
	for each_cluster in group:
		numPointsCluster = len(each_cluster[1])
		concat_samples.append(each_cluster[1].sample(int(numPointsCluster*0.25)))
	houses_stratified = pd.concat(concat_samples) 
	#Droppping cluster variable.
	houses_stratified = houses_stratified.drop("cluster", axis = 1)
	df_all = df_all.drop("cluster", axis = 1)
	#Random sampling
	houses_random = df_all.sample(int(0.25*len(df_all))) 
	return houses_stratified,houses_random
	
def pca_variances_for_all():
	#Loading Modified Housing data from Housing_data_kaggle, trading economics and other additional useful data.
	df_all = pd.read_csv("house_data.csv")
	df_all.drop_duplicates(inplace=True)
	df_all = df_all.loc[~df_all.index.duplicated(keep='first')]
	#print(df_all.columns)
	data_scaled = scale_data(df_all)
	#print(df_all.shape)
	houses_stratified,houses_random = random_and_stratified_sampling(4,data_scaled,df_all)
	houses_stratified_scaled = scale_data(houses_stratified)
	houses_random_scaled = scale_data(houses_random)
	get_top_2_pca_visualization(data_scaled,houses_random_scaled,houses_stratified_scaled)
	#mds_euclidean(data_scaled,houses_random_scaled,houses_stratified_scaled)
	#mds_correlation(data_scaled,houses_random_scaled,houses_stratified_scaled)
	#print(df_all.index.is_unique)
	
	original_loadings_attributes,random_loading_attributes,stratified_loading_attributes = scatterPlotMatrix(data_scaled,houses_random_scaled,houses_stratified_scaled,4,list(df_all.columns))
	
	save_o = pd.DataFrame(scale_data(df_all[original_loadings_attributes]))
	save_r = pd.DataFrame(scale_data(houses_random[random_loading_attributes]))
	save_s = pd.DataFrame(scale_data(houses_stratified[stratified_loading_attributes]))
	
	save_o.columns = original_loadings_attributes
	save_r.columns = random_loading_attributes
	save_s.columns = stratified_loading_attributes
	
	save_o.to_csv("static/scattero.csv",index = False)
	save_r.to_csv("static/scatterr.csv",index = False)
	save_s.to_csv("static/scatters.csv",index = False)
	
	pca_org, pca_rand, pca_strat = explain_variance(data_scaled),explain_variance(houses_random_scaled),explain_variance(houses_stratified_scaled)
	return pca_org,pca_rand,pca_strat
	
def get_top_2_pca_visualization(data_scaled,houses_random_scaled,houses_stratified_scaled):
	pcao = PCA(2)	
	pcar = PCA(2)	
	pcas = PCA(2)
	
	org = pcao.fit_transform(data_scaled)
	rand = pcar.fit_transform(houses_random_scaled)
	strat = pcas.fit_transform(houses_stratified_scaled)
	
	org = pd.DataFrame(org)
	org.columns = ["Principal_Component_1_Original","Principal_Component_2_Original"]
	rand = pd.DataFrame(rand)
	rand.columns = ["Principal_Component_1_Random","Principal_Component_2_Random"]
	strat = pd.DataFrame(strat)
	strat.columns = ["Principal_Component_1_Stratified","Principal_Component_2_Stratified"]
		
	org.to_csv("static/plotpcaorg.csv",index = False)
	rand.to_csv("static/plotpcarand.csv",index = False)
	strat.to_csv("static/plotpcastrat.csv",index = False)
	
	return org,rand,strat
	
def mds_euclidean(data_scaled,houses_random_scaled,houses_stratified_scaled):
	pcao = MDS(2)	
	pcar = MDS(2)	
	pcas = MDS(2)
	
	org = pcao.fit_transform(data_scaled)
	rand = pcar.fit_transform(houses_random_scaled)
	strat = pcas.fit_transform(houses_stratified_scaled)
	
	org = pd.DataFrame(org)
	org.columns = ["MDS_Component_1_Original","MDS_Component_2_Original"]
	rand = pd.DataFrame(rand)
	rand.columns = ["MDS_Component_1_Random","MDS_Component_2_Random"]
	strat = pd.DataFrame(strat)
	strat.columns = ["MDS_Component_1_Stratified","MDS_Component_2_Stratified"]
		
	org.to_csv("static/plotmdsorg.csv",index = False)
	rand.to_csv("static/plotmdsrand.csv",index = False)
	strat.to_csv("static/plotmdsstrat.csv",index = False)
	
def mds_correlation(data_scaled,houses_random_scaled,houses_stratified_scaled):
	mds0 = MDS(2,dissimilarity='precomputed', n_jobs=-1)
	mdsr = MDS(2,dissimilarity='precomputed', n_jobs=-1)
	mdss = MDS(2,dissimilarity='precomputed', n_jobs=-1)

	org_correlation = pd.DataFrame(data_scaled).T.corr()
	org = mds0.fit_transform(1 - org_correlation)    
	org = pd.DataFrame(org)
	org.index = org_correlation.index
	org.columns = ['x', 'y']

	rand_correlation = pd.DataFrame(houses_random_scaled).T.corr()
	rand = mdsr.fit_transform(1 - rand_correlation)    
	rand = pd.DataFrame(rand)
	rand.index = rand_correlation.index
	rand.columns = ['x', 'y']

	strat_correlation = pd.DataFrame(houses_stratified_scaled).T.corr()
	strat = mdss.fit_transform(1 - strat_correlation)    
	strat = pd.DataFrame(strat)
	strat.index = strat_correlation.index
	strat.columns = ['x', 'y']
		
	org.to_csv("static/plotmdscorrorg.csv",index = False)
	rand.to_csv("static/plotmdscorrrand.csv",index = False)
	strat.to_csv("static/plotmdscorrstrat.csv",index = False)

def scatterPlotMatrix(data_scaled,houses_random_scaled,houses_stratified_scaled,num_components,my_columns):
	# Applying PCA
	#print(my_columns)
	pcao = PCA(n_components = num_components)
	pcar = PCA(n_components = num_components)
	pcas = PCA(n_components = num_components)

	data_scaled = pcao.fit_transform(data_scaled)
	houses_random_scaled = pcar.fit_transform(houses_random_scaled)
	houses_stratified_scaled = pcas.fit_transform(houses_stratified_scaled)
	#print(pcao.components_.T)
	original_loadings = pd.DataFrame(pcao.components_.T, columns=['PC1', 'PC2', 'PC3','PC4'], index = my_columns[:-1])
	random_loading = pd.DataFrame(pcar.components_.T, columns=['PC1', 'PC2',  'PC3',  'PC4'], index=my_columns[:-1])
	stratified_loading = pd.DataFrame(pcas.components_.T, columns=['PC1', 'PC2', 'PC3',  'PC4'], index=my_columns[:-1])
	
	stratified_loading = stratified_loading.pow(2)
	stratified_loading = stratified_loading.sum(axis = 1) 
	stratified_loading = stratified_loading.sort_values(ascending=False)
	stratified_loading_attributes = list(stratified_loading.index)[:3]
	
	random_loading = random_loading.pow(2)
	random_loading = random_loading.sum(axis = 1) 
	random_loading = random_loading.sort_values(ascending=False)
	random_loading_attributes = list(random_loading.index)[:3]
	
	original_loadings = original_loadings.pow(2)
	original_loadings = original_loadings.sum(axis = 1) 
	original_loadings = original_loadings.sort_values(ascending=False)
	original_loadings_attributes = list(original_loadings.index)[:3]
	#print("Original Loadings",original_loadings)
	#print("Random Loadings",random_loading)
	#print("stratified Loadings",stratified_loading)

	return original_loadings_attributes,random_loading_attributes,stratified_loading_attributes