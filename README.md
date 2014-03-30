Suivi conso électrique (compteur EDF)
=====================================

Application Node en cours de construction ...

Dashboard

![alt tag](https://raw.githubusercontent.com/lhuet/teleinfo-app/master/doc/dashboard_desktop.png)
![alt tag](https://raw.githubusercontent.com/lhuet/teleinfo-app/master/doc/dashboard_mobile.jpeg =270x426)

Installation
------------

	git clone https://github.com/lhuet/teleinfo-app.git
	cd teleinfo-app
	npm install
	bower install
	gulp build

	sudo cp init-files/node-teleinfo /etc/init.d/node-teleinfo
	sudo cp init-files/node-teleinfo.conf /etc/node-teleinfo.conf
	sudo vi /etc/node-teleinfo.conf # Et mettre à jours les informations
	
	sudo chown pi:pi /opt/node/lib/node_modules
	sudo chown -R pi:pi /opt/node # FIXME
	npm install forever -g

Lancement
---------

Pour lancer l'application, vous devriez pouvoir lancer :

	node server.js

Et maintenant en tant que deamon :

	sudo /etc/init.d/node-teleinfo start
