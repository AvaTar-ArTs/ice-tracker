# API Endpoint Test Results

## Test 1: Fetch all news (default pagination)
**Request:** `GET http://localhost:3007/api/news`

**Response:**
```json
{
    "page": 1,
    "limit": 10,
    "total": 35,
    "totalPages": 4,
    "items": [
        {
            "id": "https://www.ice.gov/news/releases/11-charged-florida-marriage-fraud-scheme-targeting-us-service-members",
            "title": "11 charged in Florida for marriage fraud scheme targeting US service members",
            "link": "https://www.ice.gov/news/releases/11-charged-florida-marriage-fraud-scheme-targeting-us-service-members",
            "pubDate": "Wed, 11 Feb 2026 17:38:19 -0500",
            "source": "breaking",
            "description": "The Homeland Security Task Force in Jacksonville announced a multijurisdictional enforcement operation targeting a Chinese transnational criminal organization for marriage fraud. The organization recruited U.S. service members to participate in fraudulent marriages and enabled Chinese nationals to obtain immigration benefits and access cards for U.S. military installations.",
            "state": "FL"
        },
        {
            "id": "https://www.ice.gov/news/releases/sanctuary-calamity-dhs-and-ice-urgently-call-gavin-newsom-and-sanctuary-california",
            "title": "SANCTUARY CALAMITY: DHS and ICE urgently call on Gavin Newsom and sanctuary California to not release 33,179 criminal illegal aliens including murderers, sex offenders, and drug traffickers from jails back into California communities",
            "link": "https://www.ice.gov/news/releases/sanctuary-calamity-dhs-and-ice-urgently-call-gavin-newsom-and-sanctuary-california",
            "pubDate": "Fri, 06 Feb 2026 13:48:51 -0500",
            "source": "breaking",
            "description": "The U.S. Immigration and Customs Enforcement (ICE) Acting Director Todd Lyons sent a letter to California Attorney General Rob Bonta calling on him to put the safety of Americans first and honor ICE arrest detainers of the more than 33,000 criminal illegal aliens in California's custody including murderers, sex offenders, and drug traffickers.",
            "state": "CA"
        }
    ]
}
```

## Test 2: Fetch news for a specific state (California)
**Request:** `GET http://localhost:3007/api/news?state=ca`

**Response:**
```json
{
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1,
    "items": [
        {
            "id": "https://www.ice.gov/news/releases/sanctuary-calamity-dhs-and-ice-urgently-call-gavin-newsom-and-sanctuary-california",
            "title": "SANCTUARY CALAMITY: DHS and ICE urgently call on Gavin Newsom and sanctuary California to not release 33,179 criminal illegal aliens including murderers, sex offenders, and drug traffickers from jails back into California communities",
            "link": "https://www.ice.gov/news/releases/sanctuary-calamity-dhs-and-ice-urgently-call-gavin-newsom-and-sanctuary-california",
            "pubDate": "Fri, 06 Feb 2026 13:48:51 -0500",
            "source": "breaking",
            "description": "The U.S. Immigration and Customs Enforcement (ICE) Acting Director Todd Lyons sent a letter to California Attorney General Rob Bonta calling on him to put the safety of Americans first and honor ICE arrest detainers of the more than 33,000 criminal illegal aliens in California's custody including murderers, sex offenders, and drug traffickers.",
            "state": "CA"
        },
        {
            "id": "https://www.ice.gov/news/releases/ice-lodges-immigration-detainer-against-criminal-illegal-alien-accused-negligent",
            "title": "ICE lodges immigration detainer against criminal illegal alien accused of negligent vehicular manslaughter in California",
            "link": "https://www.ice.gov/news/releases/ice-lodges-immigration-detainer-against-criminal-illegal-alien-accused-negligent",
            "pubDate": "Wed, 04 Feb 2026 22:12:46 -0500",
            "source": "enforcement",
            "description": "ICE lodged an immigration detainer against Darwin Felipe Bahamon Martinez, a 21-year-old criminal illegal alien from Colombia accused of killing one and injuring another while leading Anaheim police on a high-speed chase.",
            "state": "CA"
        },
        {
            "id": "https://www.ice.gov/news/releases/ice-operation-highway-sentinel-arrests-over-100-illegal-alien-truck-drivers-gavin",
            "title": "ICE Operation Highway Sentinel arrests over 100 illegal alien truck drivers in Gavin Newsom's California",
            "link": "https://www.ice.gov/news/releases/ice-operation-highway-sentinel-arrests-over-100-illegal-alien-truck-drivers-gavin",
            "pubDate": "Tue, 23 Dec 2025 12:26:08 -0500",
            "source": "breaking",
            "description": "On Dec. 23, ICE Homeland Security Investigations San Francisco and HSI Los Angeles, along with federal partners, announced the successful conclusion of Operation Highway Sentinel, which resulted in the arrests of 101 illegal aliens truck drivers on California highways. This operation took place throughout California, where Gov. Gavin Newsom issued thousands of commercial driver's licenses to illegal aliens who then went on to cause multiple high-profile fatal accidents in California, Florida and Oregon.",
            "state": "CA"
        }
    ]
}
```

## Test 3: Fetch news with pagination (page 2, limit 5)
**Request:** `GET http://localhost:3007/api/news?page=2&limit=5`

**Response:**
```json
{
    "page": 2,
    "limit": 5,
    "total": 35,
    "totalPages": 7,
    "items": [
        {
            "id": "https://www.ice.gov/news/releases/mexican-couple-sentenced-manufacturing-selling-thousands-counterfeit-ids-nationwide",
            "title": "Mexican couple sentenced for manufacturing, selling thousands of counterfeit IDs nationwide",
            "link": "https://www.ice.gov/news/releases/mexican-couple-sentenced-manufacturing-selling-thousands-counterfeit-ids-nationwide",
            "pubDate": "Mon, 02 Feb 2026 20:07:03 -0500",
            "source": "breaking",
            "description": "An investigation by ICE Homeland Security Investigations Dallas uncovered a nationwide counterfeit document scheme resulting in the federal sentencing of two Mexican nationals who produced and sold thousands of fake IDs."
        },
        {
            "id": "https://www.ice.gov/news/releases/texas-man-sentenced-role-border-tunnel-smuggling-conspiracy",
            "title": "Texas man sentenced for role in border tunnel smuggling conspiracy",
            "link": "https://www.ice.gov/news/releases/texas-man-sentenced-role-border-tunnel-smuggling-conspiracy",
            "pubDate": "Mon, 02 Feb 2026 19:35:41 -0500",
            "source": "breaking",
            "description": "Following an ICE Homeland Security Investigations El Paso investigation, a local man was sentenced Jan. 28 to federal prison for his role in a cross-border tunnel smuggling conspiracy.",
            "state": "TX"
        },
        {
            "id": "https://www.ice.gov/news/releases/5-37-fugitives-expelled-mexico-were-targets-ice-el-paso-investigation-foreign",
            "title": "5 of 37 fugitives expelled from Mexico were targets of ICE El Paso investigation into foreign terrorist organizations",
            "link": "https://www.ice.gov/news/releases/5-37-fugitives-expelled-mexico-were-targets-ice-el-paso-investigation-foreign",
            "pubDate": "Mon, 02 Feb 2026 18:59:33 -0500",
            "source": "breaking",
            "description": "Five of the 37 fugitives expelled from Mexico into the U.S. on Jan. 20 were subjects of an ICE Homeland Security Investigations probe into cells of the Cartel de Jalisco Nueva Generación and the Sinaloa Cartel.",
            "state": "DE"
        },
        {
            "id": "https://www.ice.gov/news/releases/ice-arrests-criminal-illegal-alien-sexual-predator-final-order-removal-new-york",
            "title": "ICE arrests criminal illegal alien, sexual predator with final order of removal in New York",
            "link": "https://www.ice.gov/news/releases/ice-arrests-criminal-illegal-alien-sexual-predator-final-order-removal-new-york",
            "pubDate": "Sun, 01 Feb 2026 23:17:51 -0500",
            "source": "enforcement",
            "description": "ICE Buffalo arrested Jose Mendoza, a sexual predator from El Salvador, on Jan. 5.",
            "state": "NY"
        },
        {
            "id": "https://www.ice.gov/news/releases/ice-arrests-650-illegal-aliens-west-virginia",
            "title": "ICE arrests 650 illegal aliens in West Virginia",
            "link": "https://www.ice.gov/news/releases/ice-arrests-650-illegal-aliens-west-virginia",
            "pubDate": "Fri, 30 Jan 2026 09:19:53 -0500",
            "source": "enforcement",
            "description": "ICE Philadelphia deployed surge teams to Martinsburg, Moorefield, Morgantown, Beckley, Huntington and Charleston as part of the operation.",
            "state": "WV"
        }
    ]
}
```

## Summary
All three test cases are working correctly:
- Test 1: Returns all news with default pagination (page 1, limit 10)
- Test 2: Returns filtered news for California state (3 items, all on page 1)
- Test 3: Returns paginated results (page 2, limit 5) with correct updated totals