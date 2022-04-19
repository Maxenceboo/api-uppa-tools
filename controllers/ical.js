////////"https://ade.univ-pau.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=5769&projectId=4&calType=ical&nbWeeks=4"
const https = require('https')  // Import https module


function calenDate(icalStr)  {  // Convert an ical date to a javascript date
  // icalStr = '20110914T184000Z'             
  var strYear = icalStr.substr(0,4);
  var strMonth = parseInt(icalStr.substr(4,2))-1;
  var strDay = icalStr.substr(6,2);
  var strHour = icalStr.substr(9,2);
  var strMin = icalStr.substr(11,2);
  var strSec = icalStr.substr(13,2);

  var oDate =  new Date(strYear,strMonth, strDay, strHour, strMin, strSec)

return oDate;
}

function today(a){  // Check if a date is today 
  let today = new Date(Date.now())
  if (today.getFullYear() == a.getFullYear() && today.getDate() == a.getDate() && today.getMonth() == a.getMonth())
  {
    return true
  }
  return false
  
}


/**
 * @param {string} link 
 * @returns {string}
 */

function get(link){
  return new Promise(resolve=>{
    https.get(link, (res=>{
      let data = ""
      res.on('data', (chunk) => {
        data += chunk.toString()
      });

      // La réponse complète à été reçue. On affiche le résultat.
      res.on('end', () => {
        resolve(data)
      });
    }))
  })
}

/**
 * @param {string} link
 * @returns {Array<string>}
 */
function getAllEvents(link){  // Get all events from a link 
  return new Promise(async resolve=>{ // Return an array of events
    const data = await get(link)  // Get the data from the link
    const lines = data.split("\n")  // Split the data into lines

    let isParsingAnEvent = false  // Check if we are parsing an event
    let currentEvent = "" 
    /**
     * @type {Array<string>}
     */
    const events = []

    lines.forEach(line=>{ // For each line in the data
      line = line.trim()  // Remove the spaces at the beginning and the end of the line
      if(!isParsingAnEvent && line == "BEGIN:VEVENT"){  // If we are not parsing an event and the line is "BEGIN:VEVENT"
        isParsingAnEvent = true // We are parsing an event
        return
      }
      if(isParsingAnEvent && line == "END:VEVENT"){ // If we are parsing an event and the line is "END:VEVENT"
        events.push(currentEvent.trim())  // Add the current event to the array of events
        currentEvent = "" // Reset the current event
        isParsingAnEvent = false  // We are not parsing an event anymore
        return
      }
      if(isParsingAnEvent){ // If we are parsing an event
        currentEvent = [currentEvent, line].join("\n")  // Add the line to the current event
      }
    })

    resolve(events) // Return the array of events
  })
}

// DTSTART:2022 02 14 T 13 40 00 Z
// DTEND:20220214T151000Z
// SUMMARY:TD Programmation 2 : (imperative)
// LOCATION:405 Salle de cours
// DESCRIPTION:\n1611142926864\nPromo. L1 Info.\nNAVARRO Xavier\n(Exported :
    //  09/02/2022 21:43)\n

function parse(ressource){  // Parse an event and return a javascript object
  return new Promise(async resolve => { // Return a javascript object with the event information 
    const events = await getAllEvents(`https://ade.univ-pau.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=${ressource}&projectId=4&calType=ical&nbWeeks=4`)
    const eventsObjects = []
    events.forEach(eventString => {  // For each event in the array of events 
      const event = {}
      eventString.split("\n").forEach((line, i, eventArray)=>{  // For each line in the event    // Split the event into lines 
        const [name, value] = line.split(":") // Split the line into name and value 
        if(["DTSTART", "DTEND"].includes(name)){  // If the line is a date  
          event[name] = calenDate(value)  // Convert the date to a javascript date
        }
        if(["SUMMARY", "LOCATION", "DESCRIPTION"].includes(name)){  // If the line is a string 
          event[name] = value // Add the string to the event
        }
        eventsObjects.push(event) // Add the event to the array of events
      })
    })

    const dates = []

    resolve(  // Return the array of events
      eventsObjects
        .filter(({ DTSTART }) => {  // Filter the events with a date
          if (dates.includes(DTSTART.getTime())) return false // If the date is already in the array of dates, return false
          dates.push(DTSTART.getTime())
          //return true
          return today(DTSTART)
        })
        .sort((a, b) => a.DTSTART.getTime() - b.DTSTART.getTime())  // Sort the events by date
    )

  })
}



module.exports = {
  edt : async (req, res, next) => {
    const ressource = req.params.ressource;
    res.status(200).json({
      edt: await parse(ressource)
    });
  }
}