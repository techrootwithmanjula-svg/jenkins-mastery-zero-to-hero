/**
 * @swagger
 * components:
 *   schemas:
 *     Parent:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         user_id: { type: integer }
 *         name: { type: string }
 *         dob: { type: string, format: date, nullable: true }
 *         address: { type: string, nullable: true }
 *         permanent_address: { type: string, nullable: true }
 *         emergency_contact_number: { type: string, nullable: true }
 *         email: { type: string, nullable: true }
 *         gender: { type: string, enum: [male, female, other], nullable: true }
 *         mother_name: { type: string, nullable: true }
 *         father_name: { type: string, nullable: true }
 *         mother_occupation: { type: string, nullable: true }
 *         father_occupation: { type: string, nullable: true }
 *         image_url: { type: string, nullable: true }
 *         created_at: { type: string, format: date-time }
 *         updated_at: { type: string, format: date-time }
 *     Baby:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         parent_id: { type: integer }
 *         name: { type: string }
 *         dob: { type: string, format: date, nullable: true }
 *         gender: { type: string, enum: [male, female, other], nullable: true }
 *         image_url: { type: string, nullable: true }
 *         any_period_disease: { type: string, nullable: true }
 *         note: { type: string, nullable: true }
 *         created_at: { type: string, format: date-time }
 *         updated_at: { type: string, format: date-time }
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         status: { type: string }
 *         message: { type: string }
 *         data:
 *           type: object
 *           properties:
 *             parent:
 *               $ref: '#/components/schemas/Parent'
 *             babies:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Baby'
 *     UpsertProfileRequest:
 *       type: object
 *       properties:
 *         parent:
 *           type: object
 *           properties:
 *             name: { type: string }
 *             dob: { type: string, format: date }
 *             address: { type: string }
 *             permanent_address: { type: string }
 *             emergency_contact_number: { type: string }
 *             email: { type: string, format: email }
 *             gender: { type: string, enum: [male, female, other] }
 *             mother_name: { type: string }
 *             father_name: { type: string }
 *             mother_occupation: { type: string }
 *             father_occupation: { type: string }
 *             image_url: { type: string, format: uri }
 *         babies:
 *           type: array
 *           description: Each item is created (no id) or updated (id provided). Missing field = no change for PATCH.
 *           items:
 *             type: object
 *             properties:
 *               id: { type: integer, description: "Present → update; absent → create" }
 *               name: { type: string }
 *               dob: { type: string, format: date }
 *               gender: { type: string, enum: [male, female, other] }
 *               image_url: { type: string, format: uri }
 *               any_period_disease: { type: string }
 *               note: { type: string }
 *
 * /api/profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get parent profile + all babies (authenticated user)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Parent profile not found
 *   put:
 *     tags: [Profile]
 *     summary: Full upsert — creates or fully replaces parent; creates/updates provided babies
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertProfileRequest'
 *     responses:
 *       200:
 *         description: Profile saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Baby does not belong to this user
 *   patch:
 *     tags: [Profile]
 *     summary: Partial upsert — updates only fields provided; babies field optional
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertProfileRequest'
 *     responses:
 *       200:
 *         description: Profile saved
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Baby does not belong to this user
 *
 * /api/babies/{id}:
 *   delete:
 *     tags: [Profile]
 *     summary: Delete a baby record (only if it belongs to logged-in user's parent profile)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Baby deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Baby does not belong to this user
 *       404:
 *         description: Baby not found
 */
