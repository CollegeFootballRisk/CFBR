export interface paths {
    "/api/bugs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Bug
         * @description Submit a new bug report.
         */
        post: operations["create_bug_api_bugs_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bugs/{bug_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Bug
         * @description Partially update a bug report.
         */
        patch: operations["update_bug_api_bugs__bug_id__patch"];
        trace?: never;
    };
    "/api/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health */
        get: operations["health_api_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** ApiResponse[NoneType] */
        ApiResponse_NoneType_: {
            /** Status */
            status: number;
            /** Message */
            message: string;
            /** Data */
            data: null;
        };
        /**
         * BugCategory
         * @enum {string}
         */
        BugCategory: "map" | "account" | "gameplay" | "UI_design" | "performance" | "other";
        /**
         * BugCreate
         * @description Fields accepted when creating a report.
         */
        BugCreate: {
            /** Title */
            title: string;
            category: components["schemas"]["BugCategory"];
            severity: components["schemas"]["BugSeverity"];
            /** Description */
            description: string;
            /** Reproduction Steps */
            reproduction_steps?: string | null;
            /** Expected Behavior */
            expected_behavior?: string | null;
            /** Actual Behavior */
            actual_behavior?: string | null;
            /**
             * Can Produce Consistently
             * @default false
             */
            can_produce_consistently: boolean;
            /** User Agent */
            user_agent?: string | null;
            /** Page Url */
            page_url?: string | null;
            /** Viewport Width */
            viewport_width?: number | null;
            /** Viewport Height */
            viewport_height?: number | null;
            /** Locale */
            locale?: string | null;
            /** Timezone */
            timezone?: string | null;
            /** App Version */
            app_version: string;
            /** Git Commit */
            git_commit: string;
            /** Username */
            username?: string | null;
        };
        /**
         * BugSeverity
         * @enum {string}
         */
        BugSeverity: "low" | "medium" | "high" | "critical";
        /**
         * BugStatus
         * @enum {string}
         */
        BugStatus: "open" | "in_progress" | "resolved" | "closed";
        /**
         * BugUpdate
         * @description Fields permitted when updating bug-report workflow and Discord data.
         */
        BugUpdate: {
            status?: components["schemas"]["BugStatus"] | null;
            /** Discord Ticket Status */
            discord_ticket_status?: string | null;
            /** Discord Thread Id */
            discord_thread_id?: string | null;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
            /** Input */
            input?: unknown;
            /** Context */
            ctx?: Record<string, never>;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    create_bug_api_bugs_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BugCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponse_NoneType_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_bug_api_bugs__bug_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                bug_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BugUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiResponse_NoneType_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    health_api_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
}
