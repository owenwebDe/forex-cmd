export const MT5_CONFIG = {
  // MT5 Manager API Configuration
  API_URL: "http://173.208.156.141:6701",
  SWAGGER_URL: "http://173.208.156.141:6701/swagger/index.html",

  // Manager Credentials
  MANAGER_ID: 1146,
  MANAGER_PASSWORD: "@tCnE8Sc",

  // Server Configuration
  SERVER_IP: "86.104.251.148:443",
  SERVER_NAME: "MT5-Live-Server",

  // Default Account Settings
  DEFAULT_GROUP: "demo\\demoforex",
  DEFAULT_LEVERAGE: 100,
  DEFAULT_BALANCE: 10000,

  // API Endpoints
  ENDPOINTS: {
    CREATE_ACCOUNT: "/Account/Create",
    GET_ACCOUNT: "/Account/Get",
    UPDATE_ACCOUNT: "/Account/Update",
    GET_BALANCE: "/Account/Balance",
    BALANCE_OPERATION: "/Account/BalanceOperation",
    GET_POSITIONS: "/Trading/Positions",
    GET_HISTORY: "/Trading/History",
    GET_SYMBOLS: "/Market/Symbols",
    GET_QUOTES: "/Market/Quotes",
  },

  // Request Timeout
  TIMEOUT: 30000,

  // Retry Configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
}

export const ACCOUNT_GROUPS = {
  DEMO: "demo\\demoforex",
  ENC: "real\\enc",
  Silver: "real\\silver", 
  Prime: "real\\prime",
  Standard: "real\\standard",
  Gold: "real\\gold",
  Cent: "real\\cent",
}

export const LEVERAGE_OPTIONS = [10, 50, 100, 200, 300, 400, 500]
