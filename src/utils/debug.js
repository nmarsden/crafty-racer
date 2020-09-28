export let Debug = {
    isEnabled:false,

    findEntitiesWithName: function(entityName) {
        var foundEntities = [];
        var entities = Crafty("*");
        if (entities.length === 0) {
            return foundEntities;
        }
        for (var id in entities) {
            if (!entities.hasOwnProperty(id) || id == "length") continue; //skip
            var entity = Crafty(parseInt(id, 10));
            if (entity._entityName === entityName) {
                foundEntities.push(entity);
            }
        }
        return foundEntities;
    },

    allOtherEntityNames: function() {
        var otherNames = [];
        var entities = Crafty("*");
        if (entities.length === 0) {
            return otherNames;
        }
        for (var id in entities) {
            if (!entities.hasOwnProperty(id) || id == "length") continue; //skip
            var entity = Crafty(parseInt(id, 10));
            if (entity.length == 0) continue; //skip
            if (entity.has("Ground_Tops") || entity.has("Solid_Tops") || entity.has("Objects") ) {
                // do nothing
            } else {
                if (entity._entityName) {
                    otherNames.push(entity._entityName);
                } else {
                    otherNames.push(entity);
                }
            }
        }
        return otherNames;
    },

    numberOfEntityHandlers: function() {
        var entityHandlers = [], totalHandlers = 0;
        Object.keys(Crafty.handlers()).forEach(
            function(eventName) {
                var numEventHandlers = Object.keys(Crafty.handlers()[eventName]).length;
                totalHandlers += numEventHandlers;
                entityHandlers.push(numEventHandlers + " " + eventName);
            });
        entityHandlers.push(totalHandlers + " Total");
        return entityHandlers
    },

    logEntitiesAndHandlers: function(message) {
        if (!Debug.isEnabled) {
            return;
        }
        var total = Crafty("*").length;
        var groundNum = Crafty("Ground_Tops").length;
        var solidNum = Crafty("Solid_Tops").length;
        var objectNum = Crafty("Objects").length;
        var otherNum = total - (groundNum + solidNum + objectNum);
        console.log(message, " - Entities: ", total, "Total,", groundNum, "Ground,", solidNum, "Solid,", objectNum, "Objects,", otherNum, "Other");
        console.log("Other entities:", Debug.allOtherEntityNames());
        console.log("Entity Handlers:", Debug.numberOfEntityHandlers());
    },

    logTriggeredEvents: function() {
        if (!Debug.isEnabled) {
            return;
        }
        Crafty.bind('WaypointReached', function() { console.log("WaypointReached triggered") });
        Crafty.bind('TimesUp', function() { console.log("TimesUp triggered") });
        Crafty.bind('OffTheEdge', function() { console.log("OffTheEdge triggered") });
        Crafty.bind('EnterFrame', function() { console.log("EnterFrame triggered") });
        Crafty.bind('PauseGame', function() { console.log("PauseGame triggered") });
        Crafty.bind('UnpauseGame', function() { console.log("UnpauseGame triggered") });
    }
}