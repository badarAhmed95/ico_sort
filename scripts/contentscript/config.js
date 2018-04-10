var selectors = {
	tableUpcomingIco : 'div.tabs__content.active .col-lg-6.col-md-12.col-12',
	upcomingIco_header : 'div header.category-table-header',
	interestDiv: 'div.interest',
	categoryDiv:'div.categ_type',
	recievedDiv:'new_column_categ_invisted',
	goalDiv:'categ_desctop',
	ico_row:'div.col-md-12.col-12.a_ico',
	category_desk:'div .category-desk',
	categoryTabDiv:'div.categ_new_tabs',
	tableWrapperDiv:'#careg_ico',
	dateColumnDiv:'div.date.active'
};
var sortOrder = {
	interest_asc: [
		'Not Rated',
    'Neutral',
		'Low',
		'Medium',
		'High',
		'Very High',
		'Sponsored'
	],
	interest_dsc: [
		'Sponsored',
		'Neutral',
		'Very High',
		'High',
		'Medium',
		'Low',
		'Not Rated'
	],
	category_asc: [
		'Blockchain',
		'Blockchain Service',
		'Protocol',
		'Exchange',
		'Cloud Storage',
		'Data Service',
		'Artificial Intelligence',
		'Social Network',
		'Mobile',
		'Healthcare',
		'Advertising',
		'Dapp',
		'Smart Contract',
		'Real Business',
		'Gaming',
		'Finance',
		'Gambling',
		'Verification',
		'Currency',
		'Security',
		'Payments',
		'Trading',
		'Marketplace'
	],
	category_dsc: [
    'Marketplace',
		'Trading',
		'Payments',
    'Security',
    'Currency',
    'Verification',
    'Gambling',
    'Finance',
    'Gaming',
    'Real Business',
    'Smart Contract',
    'Dapp',
    'Advertising',
    'Healthcare',
    'Mobile',
    'Social Network',
    'Artificial Intelligence',
    'Data Service',
    'Cloud Storage',
    'Exchange',
    'Protocol',
    'Blockchain Service',
    'Blockchain'
	],
  recieved_dsc:[
  	'Descending Values',
		'Pending'
	],
	recieved_asc:[
		'Pending',
		'Aescending Values'
	],
	goal_asc:[
    'Not Set',
		'Aescending Values'
	],
	goal_dsc:[
		'Descending Values',
		'Not Set'
	],
  date_asc:[
    'DATE: TBA',
    'Aescending Values'
  ],
  date_dsc:[
    'Descending Values',
    'DATE: TBA'
  ]
}
