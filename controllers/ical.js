////////"https://ade.univ-pau.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=5769&projectId=4&calType=ical&nbWeeks=4"
const https = require('https')


function calenDate(icalStr)  {
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

function today(a){
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
function getAllEvents(link){
  return new Promise(async resolve=>{
    const data = await get(link)
    const lines = data.split("\n")

    let isParsingAnEvent = false
    let currentEvent = ""
    /**
     * @type {Array<string>}
     */
    const events = []

    lines.forEach(line=>{
      line = line.trim()
      if(!isParsingAnEvent && line == "BEGIN:VEVENT"){
        isParsingAnEvent = true
        return
      }
      if(isParsingAnEvent && line == "END:VEVENT"){
        events.push(currentEvent.trim())
        currentEvent = ""
        isParsingAnEvent = false
        return
      }
      if(isParsingAnEvent){
        currentEvent = [currentEvent, line].join("\n")
      }
    })

    resolve(events)
  })
}

// DTSTART:2022 02 14 T 13 40 00 Z
// DTEND:20220214T151000Z
// SUMMARY:TD Programmation 2 : (imperative)
// LOCATION:405 Salle de cours
// DESCRIPTION:\n1611142926864\nPromo. L1 Info.\nNAVARRO Xavier\n(Exported :
    //  09/02/2022 21:43)\n

function parse(ressource){
  return new Promise(async resolve => {
    const events = await getAllEvents(`https://ade.univ-pau.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=${ressource}&projectId=4&calType=ical&nbWeeks=4`)
    const eventsObjects = []
    events.forEach(eventString => {
      const event = {}
      eventString.split("\n").forEach((line, i, eventArray)=>{
        const [name, value] = line.split(":")
        if(["DTSTART", "DTEND"].includes(name)){      
          event[name] = calenDate(value) 
        }
        if(["SUMMARY", "LOCATION", "DESCRIPTION"].includes(name)){
          event[name] = value
        }
        eventsObjects.push(event)
      })
    })

    const dates = []

    resolve(
      eventsObjects
        .filter(({ DTSTART }) => {
          if (dates.includes(DTSTART.getTime())) return false
          dates.push(DTSTART.getTime())
          //return true
          return today(DTSTART)
        })
        .sort((a, b) => a.DTSTART.getTime() - b.DTSTART.getTime())
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