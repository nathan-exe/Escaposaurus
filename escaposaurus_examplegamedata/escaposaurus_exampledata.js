<!--
/////////////////////////////////////////////////////////////
/// Escapausorus v1 (2020)
///	A quick and dirty framework to create small adventure game (certified vanilla JS)
/// Author: Stéphanie Mader (http://smader.interaction-project.net)
/// GitHub: https://github.com/RedNaK/escaposaurus
///	Licence: MIT
////////////////////////////////////////////////////////////
-->

	/*
		HERE IS THE CONFIGURATION OF THE GAME
	*/
		/*either online with VOD server and JSON load of data
		either local */
		var isLocal = true ;
 		var gameRoot = "./" ;
 		var gameDataRoot = gameRoot+"escaposaurus_examplegamedata/" ;
 		var videoRoot = gameDataRoot+"videos/" ;

 		/*caller app*/
		var contactVideoRoot = videoRoot+"contactVideo/" ;

		/*full path to intro / outro video*/
		var missionVideoPath = videoRoot+"introVideo/intro1.mp4" ;
		var introVideoPath = videoRoot+"introVideo/intro2.mp4" ;
		var missingVideoPath = videoRoot+"contactVideo/missing/final.mp4" ;
		var epilogueVideoPath = videoRoot+"epilogueVideo/epiloguecredit.mp4" ;

		/*udisk JSON path*/
		var udiskRoot = gameDataRoot+"udisk/" ;

		/*for online use only*/
		/*var udiskJSONPath = gameRoot+"escaposaurus_gamedata/udisk.json" ;
		var udiskJSONPath = "/helper_scripts/accessJSON_udisk.php" ;*/

		//doc instructions base de données avec format des clés

		var udiskData =
	  	{"root":{
	  		"folders":
		  		[
				{
					"foldername":"Dossier_Karim_DuFoin",
			  		"files":["Lettre_Grand_Pere.png","photo_recto.jpg","photo_verso.jpg"]
				},
				{"foldername":"Moteur_de_recherche_Archives",
			  		"files":[],
			  		"folders":[
					{"foldername":"Archives_Presse","password":"saintMoulin1940","placeholder":"Paris1920","sequence":0,
						"files":["carte1.jpg", "carte2.jpg", "carte3.jpg", "carte4.jpg"]
					},
					{"foldername":"Archives_Communiquations_CNR","password":"OperationDomino","placeholder":"OperationCaramel","sequence":1,
						"files":["20180807_103031.jpg", "20180807_114356.jpg", "20180807_123538.mp4"]
					},
					{"foldername":"Archives_Cartes_CCVR","password":"franc-tireurs","placeholder":"rouges","sequence":2,
						
					},
					]
			  	}
		  		
		 		],
			"files":[
				"coupure_de_presse.jpg"
			]}
		} ;

		//situation initiale
		var gameTitle = "Le juste anonyme" ;
		var gameDescriptionHome = "Vous êtes généalogiste spécialisé dans la recherche historique.<br/>Votre métier est de reconstituer l'histoire de personnages historiques anonymes en explorant divers archives." ;
		var gameMissionCall = "Nouveau client : Karim a trouvé une photo et une lettre dans le grenier de son grand-père décédé." ;
		var gameMissionAccept = "&raquo;&raquo; Retrouver le résistant qui a sauvé le grand-père de Karim pendant la guerre&laquo;&laquo;" ;

		var gameCredit = "Un jeu conçu et réalisé par : <br/>Maxim Raymond <br/>Arzel Gomezlinot <br/>Quentin Borredon <br/>Timothée Bourson <br/>Ernest Bruyere <br/>Axel Gauthier <br/>Nathan Tazi" ;
		var gameThanks = "Remerciements : <br/> ;)" ;

		var OSName = "Special InformaticienOS 3.11- diskloaded: Escaposaurus_Example" ;
		var explorerName = "ARCHIVES" ;
		var callerAppName = "CALL CONTACT" ;

		/*titles of video windows*/
		var titleData = {} ;
		titleData.introTitle = "INTRODUCTION" ;
		titleData.epilogueTitle = "EPILOGUE" ;
		titleData.callTitle = "APPEL EN COURS..." ;

		/*change of caller app prompt for each sequence*/
		var promptDefault = "Rien à demander, ne pas les déranger." ;
		var prompt = [] ;
		prompt[0] = "Prendre contact" ;
		prompt[1] = "" ;
		prompt[2] = "" ;
		prompt[3] = "Envoyer la carte" ;
		prompt[4] = "Appeler Nathalie pour savoir où en sont les secours." ;

		/*when the sequence number reach this, the player win, the missing contact is added and the player can call them*/
		var sequenceWin = 4 ;

		/*before being able to call the contacts, the player has to open the main clue of the sequence as indicated in this array*/
		/*if you put in the string "noHint", player will be able to immediatly call the contact at the beginning of the sequence*/
		/*if you put "none" or anything that is not an existing filename, the player will NOT be able to call the contacts during this sequence*/
		var seqMainHint = [] ;
		seqMainHint[0] = "nohint" ;
		seqMainHint[1] = "nohint" ; /*if you put anything that is not an existing filename of the udisk, the player will never be able to call any contacts or get helps during this sequence*/
		seqMainHint[2] = "nohint" ;
		seqMainHint[3] = "nohint" ;

		/*contact list, vid is the name of their folder in the videoContact folder, then the game autoload the video named seq%number of the current sequence%, e.g. seq0.MP4 for the first sequence (numbered 0 because computer science habits)
	their img need to be placed in their video folder, username is their displayed name*/
		var normalContacts = [] ;
		normalContacts[0] = {"vid" : "Archiviste", "vod_folder" : "", "username" : "George Fouille (Archiviste)", "canal" : "video", "avatar" : "Archiviste.png"} ;
		normalContacts[1] = {"vid" : "Client", "vod_folder" : "", "username" : "Karim Du Foins (Client)", "canal" : "video", "avatar" : "Client.png"} ;
		normalContacts[2] = {"vid" : "Vieux", "vod_folder" : "", "username" : "Jean Luc Des Prés (Vétéran)", "canal" : "video", "avatar" : "Vieux.png"} ;

		/*second part of the list, contact that can help the player*/
		var helperContacts = [] ;
		helperContacts[0] = {"vid" : "Archiviste_help", "vod_folder" : "", "username" : "George Fouille (pour avoir un indice)", "canal" : "txt", "avatar" : "Archiviste_help.png", "bigAvatar" : "Archiviste_help.png"} ;
		/*helperContacts[1] = {"vid" : "Lou", "username" : "Lou (pour avoir un deuxième indice) - par message", "canal" : "txt", "avatar" : "Lou_opt.jpg", "bigAvatar" : "avatarHelper2Big.gif"} ;*/

		/*ce qui apparait quand on trouve le dernier élément du disque dur*/
		finalStepAdded = "Vous avez identifié le juste anonyme de la photo !" ;

		/*the last call, it can be the person we find in the end or anyone else we call to end the quest, allows the game to know it is the final contact that is called and to proceed with the ending*/
		var missingContact = {"vid" : "missing", "vod_folder" : "","username" : "Nathalie",  "canal" : "video", "avatar" : "nata_avatar.jpg"} ;

		/*Lou only send text message, they are stored here*/
		var tips = {} ;
		tips['Archiviste_help'] = [] ;
		tips['Archiviste_help'][0] = "Je peux pas répondre à votre appel. Mais je peux vous répondre par écrit. Donc vous cherchez le surnom d'un guide ? Je crois que les contacts sont des guides justement, essayez peut-être de les appeler." ;
		tips['Archiviste_help'][1] = "" ;
		tips['Archiviste_help'][2] = "" ;
		tips['Archiviste_help'][3] = "Ah zut, un dossier verouillé sans infos dans scan mémo ? Y'a forcément un truc mnémotechnique facile à retenir ou retrouver. Les guides en disent quoi ?" ;


		/*text for the instruction / solution windows*/
		var instructionText = {} ;
		instructionText.winState = "Vous avez retrouvé l'id GPS et vous pouvez appeler les secours du secteur." ;
		instructionText.lackMainHint = "" ;
		instructionText.password = "Vous devez trouver et entrer le mot de passe d'un des dossiers de la boite de droite. Vous pouvez trouver le mot de passe en appelant les contacts de la boite de gauche.<br/>Pour entrer un mot de passe, cliquez sur le nom d'un dossier et une fenêtre s'affichera pour que vous puissiez donner le mot de passe." ;

		/*please note the %s into the text that allow to automatically replace them with the right content according to which sequence the player is in*/
		var solutionText = {} ;
		solutionText.winState = "Si Sabine a été secourue, le jeu est fini bravo." ;
		solutionText.lackMainHint = "Vous devez ouvrir le fichier <b>%s</b><br/>" ;
		solutionText.password = "Vous devez déverouiller le dossier <b>%s1</b><br/>avec le mot de passe : <b>%s2</b><br/>" ;