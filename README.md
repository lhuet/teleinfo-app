Suivi conso électrique (compteur EDF)
=====================================

Application Node en cours de construction ...

Installation
------------

	git clone https://github.com/lhuet/teleinfo-app.git
	cd teleinfo-app
	npm install

	sudo cp init-files/node-teleinfo /etc/init.d/node-teleinfo
	sudo cp init-files/node-teleinfo.conf /etc/node-teleinfo.conf
	sudo vi /etc/node-teleinfo.conf # Et mettre à jours les informations
	
	sudo chown pi:pi /opt/node/lib/node_modules
	sudo chown -R pi:pi /opt/node # FIXME
	npm install forever -g

Lancement
---------

Pour lancer l'application, vous devriez pouvoir lancer :

	node teleinfo-app.js

Et maintenant en tant que deamon :

	sudo /etc/init.d/node-teleinfo start
