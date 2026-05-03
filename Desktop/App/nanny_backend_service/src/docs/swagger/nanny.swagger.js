/**
 * @swagger
 * components:
 *   schemas:
 *     Nanny:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         user_id: { type: integer, description: FK to users.id }
 *         first_name: { type: string }
 *         middle_name: { type: string, nullable: true }
 *         last_name: { type: string }
 *         dob: { type: string, format: date }
 *         image: { type: string, nullable: true }
 *         mobile_number: { type: string }
 *         email_id: { type: string }
 *         gender: { type: string, enum: [male, female, other] }
 *         address: { type: string, nullable: true }
 *         permanent_address: { type: string, nullable: true }
 *         emergency_contact: { type: string, nullable: true }
 *         certificates:
 *           type: array
 *           items: { type: string, format: uri }
 *         experience:
 *           type: number
 *           description: Years of experience (numeric)
 *         aadhar_number: { type: string }
 *         pan_card: { type: string }
 *         is_active: { type: boolean }
 *         created_at: { type: string, format: date-time }
 *         updated_at: { type: string, format: date-time }
 *     NannyCreateRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - first_name
 *         - last_name
 *         - dob
 *         - mobile_number
 *         - email_id
 *         - gender
 *         - experience
 *         - aadhar_number
 *         - pan_card
 *       properties:
 *         user_id: { type: integer }
 *         first_name: { type: string }
 *         middle_name: { type: string }
 *         last_name: { type: string }
 *         dob: { type: string, format: date }
 *         image: { type: string, format: uri }
 *         mobile_number: { type: string }
 *         email_id: { type: string, format: email }
 *         gender: { type: string, enum: [male, female, other] }
 *         address: { type: string }
 *         permanent_address: { type: string }
 *         emergency_contact: { type: string }
 *         certificates:
 *           type: array
 *           items: { type: string, format: uri }
 *         experience: { type: number }
 *         aadhar_number: { type: string }
 *         pan_card: { type: string }
 *         is_active: { type: boolean }
 *     NannyListResponse:
 *       type: object
 *       properties:
 *         status: { type: string }
 *         message: { type: string }
 *         data:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nanny'
 *             pagination:
 *               type: object
 *               properties:
 *                 page: { type: integer }
 *                 limit: { type: integer }
 *                 total: { type: integer }
 *                 totalPages: { type: integer }
 *
 * /api/admin/nannies:
 *   post:
 *     tags: [Admin Nannies]
 *     summary: Create nanny (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NannyCreateRequest'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Duplicate unique field
 *   get:
 *     tags: [Admin Nannies]
 *     summary: List nannies with pagination and filters (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: is_active
 *         schema: { type: string, enum: [true, false] }
 *       - in: query
 *         name: gender
 *         schema: { type: string, enum: [male, female, other] }
 *       - in: query
 *         name: experience_min
 *         schema: { type: number }
 *       - in: query
 *         name: experience_max
 *         schema: { type: number }
 *       - in: query
 *         name: mobile
 *         description: Search by nanny mobile_number (partial match)
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NannyListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /api/admin/nannies/{id}:
 *   get:
 *     tags: [Admin Nannies]
 *     summary: Get nanny by id (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Nanny details
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   patch:
 *     tags: [Admin Nannies]
 *     summary: Partial update nanny (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NannyCreateRequest'
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Not found
 *       409:
 *         description: Duplicate unique field
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   put:
 *     tags: [Admin Nannies]
 *     summary: Update nanny (same as PATCH) (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NannyCreateRequest'
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Not found
 *       409:
 *         description: Duplicate unique field
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   delete:
 *     tags: [Admin Nannies]
 *     summary: Soft delete nanny (sets is_active false) (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deactivated
 *       400:
 *         description: Already inactive
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
