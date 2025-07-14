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
    CREATE_ACCOUNT: "/api/Account/Create",
    GET_ACCOUNT: "/api/Account/Get",
    UPDATE_ACCOUNT: "/api/Account/Update",
    GET_BALANCE: "/api/Account/Balance",
    BALANCE_OPERATION: "/api/Account/BalanceOperation",
    GET_POSITIONS: "/api/Trading/Positions",
    GET_HISTORY: "/api/Trading/History",
    GET_SYMBOLS: "/api/Market/Symbols",
    GET_QUOTES: "/api/Market/Quotes",
  },

  // Request Timeout
  TIMEOUT: 30000,

  // Retry Configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
}

export const ACCOUNT_GROUPS = {
  DEMO: "demo\\demoforex",
  LIVE_STANDARD: "real\\standard",
  LIVE_ECN: "real\\ecn",
  LIVE_VIP: "real\\vip",
}

export const LEVERAGE_OPTIONS = [1, 10, 20, 50, 100, 200, 300, 400, 500, 1000]
