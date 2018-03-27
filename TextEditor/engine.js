'use strict'
var str = "#include \"scene1.h\"\n#include <QOpenGLFunctions>\n\n#define MOVESTEP 0.02\n#define ANGLESTEP 3\n#define DEG2RAD 3.14159/180\n\n\nvoid Sphere(double r, float xx, float yy, float zz)\n{\n    float PI = 3.1415926535;\n    int ix, iy;\n    int nx = 36, ny = 36;\n    double x, y, z, sy, cy, sy1, cy1, sx, cx, piy, pix, ay, ay1, ax, tx, ty, ty1, dnx, dny, diy;\n    dnx = 1.0 / (double)nx;\n    dny = 1.0 / (double)ny;\n    glBegin(GL_QUAD_STRIP);\n    for (iy = 0; iy < ny; ++iy)\n    {\n        piy = PI * dny;\n        diy = (double)iy;\n        ay = diy * piy;\n        sy = sin(ay);\n        cy = cos(ay);\n        ty = diy * dny;\n        ay1 = ay + piy;\n        sy1 = sin(ay1);\n        cy1 = cos(ay1);\n        ty1 = ty + dny;\n        for (ix = 0; ix <= nx; ++ix)\n        {\n            pix = PI * dnx;\n            ax = 2.0 * ix * pix;\n            sx = sin(ax);\n            cx = cos(ax);\n            x = r * sy * cx;\n            y = r * sy * sx;\n            z = r * cy;\n            tx = (double)ix * dnx;\n            glNormal3f(x+xx, y+yy, z+zz);\n            glTexCoord2f(tx, ty);\n            glVertex3f(x+xx, y+yy, z+zz);\n            x = r * sy1 * cx;\n            y = r * sy1 * sx;\n            z = r * cy1;\n            glNormal3f(x+xx, y+yy, z+zz);\n            glTexCoord2f(tx, ty1);\n            glVertex3f(x+xx, y+yy, z+zz);\n        }\n    }\n    glEnd();\n}\n\n\nvoid Sun (float x, float y, float z, float r)\n{\n    float light0_position[] = {x, y, z, 1};\n    glLightfv (GL_LIGHT0, GL_POSITION, light0_position);\n    glEnable (GL_LIGHT0);\n    glColor3f (1, 1, 1);\n    Sphere (r, light0_position[0], light0_position[1], light0_position[2]);\n}\n\nScene1::Scene1 ()\n    : Scene (), xG(0), yG(0), zG(0), x (0), y (0), z (0), scale (0.1), xAngle (-90), yAngle (0), zAngle (0), xMouse (-1), yMouse (-1), space (0),\n      morgunMode (false), soundMode (false) {\n}\n\nvoid Scene1::drawMovingObj (float xOf, float yOf, float zOf, float rOf, float scale, bool withRocket)\n{\n    float degInRad = space * DEG2RAD;\n    float X = xOf + rOf * cos (degInRad + DEG2RAD), Y = yOf + rOf * sin (degInRad + DEG2RAD);\n    glPushMatrix ();\n    glTranslatef (X, Y, zOf);\n    glScalef (scale, scale, scale);\n    if (withRocket)\n        drawRocket ();\n    glRotatef (-90, 1, 0, 0);\n    glRotatef (-space, 0, 1, 0);\n    Sphere (1, 0, 0, 0);\n    glPopMatrix ();\n}\n\nvoid Scene1::init ()\n{\n    texture[0] = genTexture (\":/bort.jpg\");\n    texture[1] = genTexture (\":/bort2.jpg\");\n\n//    spaces[0] = genTexture (\":/space3.jpg\");\n//    spaces[1] = genTexture (\":/space2.jpg\");\n//    spaces[2] = genTexture (\":/space1.jpg\");\n\n    morhuhn = genTexture (\":/morhuhn.jpg\");\n    jupiter = genTexture(\":/jupiter.jpg\");\n    gannimed = genTexture(\":/gannimed.jpg\");\n    kallisto = genTexture(\":/kallisto.jpg\");\n    europe = genTexture(\":/europe.jpg\");\n\n    //    glMultMatrixf ();\n\n    //    glFeedbackBuffer (1, &fbo);\n}\n\n\nvoid Scene1::draw ()\n{\n    glPushMatrix ();\n    glTranslatef (xG, yG, zG);\n    glScalef (scale, scale, scale);\n\n    glRotatef (xAngle, 1, 0, 0);\n    glRotatef (yAngle, 0, 1, 1);\n    glRotatef (zAngle, 0, 0, 1);\n\n    glPushMatrix();\n\n    glBindTexture (GL_TEXTURE_2D, jupiter);\n    Sphere (1, 0, 0, 0);\n\n    glBindTexture (GL_TEXTURE_2D, europe);\n    drawMovingObj (0, 0, 0, 2, eScale);\n\n    glBindTexture (GL_TEXTURE_2D, gannimed);\n    drawMovingObj (0, 0, 0, 4, gScale, true);\n\n    glBindTexture (GL_TEXTURE_2D, kallisto);\n    drawMovingObj (0, 0, 0, 6, kScale);\n\n//    drawRocket ();\n\n    glPopMatrix ();\n    glPopMatrix ();\n\n    //    glDisable (GL_LIGHT0);\n}\n\n\nvoid Scene1::keyPressEvent (QKeyEvent *event)\n{\n    //    scale = 1;\n    //    x = y = 0;\n\n    if (event->key () == Qt::Key_Up)\n        yG += MOVESTEP;\n    else if (event->key () == Qt::Key_Down)\n        yG -= MOVESTEP;\n    else if (event->key () == Qt::Key_Right)\n        xG += MOVESTEP;\n    else if (event->key () == Qt::Key_Left)\n        xG -= MOVESTEP;\n    else if (event->key () == Qt::Key_Q)\n        xAngle += ANGLESTEP;\n    else if (event->key () == Qt::Key_A)\n        xAngle -= ANGLESTEP;\n    else if (event->key () == Qt::Key_W)\n        yAngle += ANGLESTEP;\n    else if (event->key () == Qt::Key_S)\n        yAngle -= ANGLESTEP;\n    else if (event->key () == Qt::Key_E)\n        zAngle += ANGLESTEP;\n    else if (event->key () == Qt::Key_D)\n        zAngle -= ANGLESTEP;\n    else if (event->key () == Qt::Key_Plus)\n        scale *= 1.1;\n    else if (event->key () == Qt::Key_Minus)\n        scale *= 1 / 1.1;\n}\n\n\nvoid Scene1::mousePressEvent (QMouseEvent *event)\n{\n    //    xMouse = event->x ();\n    //    yMouse = event->y ();\n}\n\n\nvoid Scene1::mouseMoveEvent (QMouseEvent *event)\n{\n    //    if (xMouse == yMouse && xMouse == -1)\n    //        return;\n\n    //    int dx = event->x () - xMouse;\n    //    int dy = event->y () - yMouse;\n\n    //    float d = (float) dx / dy;\n    //    int sign = ((d > 0) ? 1 : ((d < 0) ? -1 : 0) );\n\n    //    if (fabs (d) <= 0.5)\n    //        yAngle += ANGLESTEP * sign;\n    //    else if (fabs (d) >= 2)\n    //        xAngle = ANGLESTEP * sign;\n    //    else/* if +(dx >= 5 && dy >= 5)*/\n    //        zAngle += ANGLESTEP * sign;\n}\n\n\nvoid Scene1::mouseReleaseEvent (QMouseEvent *event)\n{\n    //    xMouse = yMouse = -1;\n}\n\n\nvoid Scene1::drawCube ()\n{\n    glBindTexture (GL_TEXTURE_2D, texture[0]);\n    //    glColorMaterial (GL_FRONT_AND_BACK, GL_AMBIENT);\n    //    glColorMaterial (GL_FRONT_AND_BACK, GL_DIFFUSE);\n    glColor3f (1, 1, 1); //blue\n    //    glColorMaterial (GL_FRONT_AND_BACK, GL_SPECULAR);\n    //    glColor3f (0.5, 0.5, 1); //blue\n\n    glBegin (GL_QUADS);\n    //front\n    //        glColor3f (0, 1.0, 0); //green\n    glTexCoord2f (0, 0);\n    glVertex3f (-0.5, 0.5, -0.5);\n    glTexCoord2f (0, 1);\n    glVertex3f (0.5, 0.5, -0.5);\n    glTexCoord2f (1, 1);\n    glVertex3f (0.5, -0.5, -0.5);\n    glTexCoord2f (1, 0);\n    glVertex3f (-0.5, -0.5, -0.5);\n\n    //up\n    //        glColor3b (127, 127, 127); // white\n    glTexCoord2f (0, 0);\n    glVertex3f (-0.5, 0.5, -0.5);\n    glTexCoord2f (0, 1);\n    glVertex3f (0.5, 0.5, -0.5);\n    glTexCoord2f (1, 1);\n    glVertex3f (0.5, 0.5, 0.5);\n    glTexCoord2f (1, 0);\n    glVertex3f (-0.5, 0.5, 0.5);\n\n    //left\n    //        glColor3b (127, 37, 0); //orange\n    glTexCoord2f (0, 0);\n    glVertex3f (-0.5, 0.5, -0.5);\n    glTexCoord2f (0, 1);\n    glVertex3f (-0.5, 0.5, 0.5);\n    glTexCoord2f (1, 1);\n    glVertex3f (-0.5, -0.5, 0.5);\n    glTexCoord2f (1, 0);\n    glVertex3f (-0.5, -0.5, -0.5);\n\n    //down\n    //        glColor3b (127, 127, 0); //yellow\n    glTexCoord2f (0, 0);\n    glVertex3f (-0.5, -0.5, -0.5);\n    glTexCoord2f (0, 1);\n    glVertex3f (-0.5, -0.5, 0.5);\n    glTexCoord2f (1, 1);\n    glVertex3f (0.5, -0.5, 0.5);\n    glTexCoord2f (1, 0);\n    glVertex3f (0.5, -0.5, -0.5);\n\n    //right\n    //        glColor3b (127, 0, 0); //red\n    glTexCoord2f (0, 0);\n    glVertex3f (0.5, 0.5, -0.5);\n    glTexCoord2f (0, 1);\n    glVertex3f (0.5, 0.5, 0.5);\n    glTexCoord2f (1, 1);\n    glVertex3f (0.5, -0.5, 0.5);\n    glTexCoord2f (1, 0);\n    glVertex3f (0.5, -0.5, -0.5);\n\n    //back\n    //        glColor3b (0, 0, 127); //blue\n    glTexCoord2f (0, 0);\n    glVertex3f (-0.5, 0.5, 0.5);\n    glTexCoord2f (0, 1);\n    glVertex3f (0.5, 0.5, 0.5);\n    glTexCoord2f (1, 1);\n    glVertex3f (0.5, -0.5, 0.5);\n    glTexCoord2f (1, 0);\n    glVertex3f (-0.5, -0.5, 0.5);\n    glEnd ();\n}\n\n\nvoid Scene1::drawCylindre ()\n{\n    glPushMatrix ();\n\n    glScalef (1, 1, 3);\n\n    //    glColorMaterial (GL_FRONT_AND_BACK, GL_AMBIENT);\n    glColor3f (0, 0, 0);\n    //    glColorMaterial (GL_FRONT_AND_BACK, GL_DIFFUSE);\n    //    glColor3f (0.5, 0, 0);\n\n    for (int j = -1; j <= 1; j += 2)\n    {\n        glBegin (GL_POLYGON);\n        for (int i = 0; i < 360; i++)\n        {\n            float degInRad = i * DEG2RAD;\n            glVertex3f (cos (degInRad), sin (degInRad), j);\n        }\n        glEnd ();\n    }\n\n\n    if (!morgunMode)\n        glBindTexture (GL_TEXTURE_2D, texture[1]);\n    else\n        glBindTexture (GL_TEXTURE_2D, morhuhn);\n    //    glColorMaterial (GL_FRONT_AND_BACK, GL_AMBIENT);\n    glColor3f (1, 1, 1);\n    for (int i = 0; i < 360; i++)\n    {\n        float degInRad = i * DEG2RAD;\n        glBegin (GL_QUADS);\n        glTexCoord2f ((float) i / 360, 1);\n        glVertex3f (cos (degInRad), sin (degInRad), -1);\n        glTexCoord2f ((float) i / 360, 0);\n        glVertex3f (cos (degInRad), sin (degInRad), 1);\n        glTexCoord2f ((float) (i + 1) / 360, 0);\n        glVertex3f (cos (degInRad + DEG2RAD), sin (degInRad + DEG2RAD), 1);\n        glTexCoord2f ((float) (i + 1) / 360, 1);\n        glVertex3f (cos (degInRad + DEG2RAD), sin (degInRad + DEG2RAD), -1);\n        glEnd ();\n    }\n\n    glPopMatrix ();\n}\n\n\nvoid Scene1::drawCone ()\n{\n    //    glColorMaterial (GL_FRONT_AND_BACK, GL_AMBIENT);\n    //    glColor3f (1, 0, 0);\n    //    glBegin (GL_POLYGON);\n    //    for (int i = 0; i < 360; i++)\n    //    {\n    //       float degInRad = i * DEG2RAD;\n    //       glVertex3f (cos (degInRad), sin (degInRad), -1);\n    //    }\n    //    glEnd ();\n\n    glBindTexture (GL_TEXTURE_2D, texture[0]);\n\n    //    glColorMaterial (GL_FRONT_AND_BACK, GL_AMBIENT);\n    //    glColor3f (1, 0, 0);\n    for (int i = 0; i < 360; i++)\n    {\n        float degInRad = i * DEG2RAD;\n        glBegin (GL_TRIANGLES);\n        glTexCoord2f ((float) i / 360, 1);\n        glVertex3f (cos (degInRad), sin (degInRad), -1);\n        glTexCoord2f (((float) i + 0.5) / 360, 0);\n        glVertex3f (0, 0, 1);\n        glTexCoord2f ((float) (i + 1) / 360, 1);\n        glVertex3f (cos (degInRad + DEG2RAD), sin (degInRad + DEG2RAD), -1);\n        glEnd ();\n    }\n}\n\nvoid Scene1::drawRocket ()\n{\n    glPushMatrix ();\n    float degInRad = 2 * space * DEG2RAD;\n    float X = x + 2 * cos (degInRad + DEG2RAD), Y = y + 2 * sin (degInRad + DEG2RAD);\n\n\n    glTranslatef (X, Y, 0);\n    glScalef (0.1, 0.1, 0.1);\n\n    glRotatef (-90, 1, 0, 0);\n    glRotatef (-2 * space, 0, 1, 0);\n\n\n    drawCylindre ();\n\n    glTranslatef (0, 0, 4);\n\n    drawCone ();\n\n    glTranslatef (0, 0, -4);\n\n    glPushMatrix ();\n\n    glTranslatef (1, 0, -3);\n    glScalef (1, 0.5, 4);\n    drawCube ();\n    glScalef (1, 2, 0.25);\n\n    glTranslatef (-2, 0, 0);\n    glScalef (1, 0.5, 4);\n    drawCube ();\n    glScalef (1, 2, 0.25);\n\n    glTranslatef (1, 1, 0);\n    glScalef (0.5, 1, 4);\n    drawCube ();\n    glScalef (2, 1, 0.25);\n\n    glTranslatef (0, -2, 0);\n    glScalef (0.5, 1, 4);\n    drawCube ();\n    glScalef (2, 1, 0.25);\n\n    glPopMatrix ();\n    glPopMatrix ();\n}\n\n\nGLuint Scene1::genTexture (QString filename)\n{\n    GLuint texture;\n    glGenTextures (1, &texture);\n    glBindTexture (GL_TEXTURE_2D, texture);\n\n    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);\n    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);\n    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);\n    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);\n\n    im.load (filename);\n    //    im = QGLWidget::convertToGLFormat (im);\n    im = im.convertToFormat (QImage::Format_RGB888);\n    glTexImage2D (GL_TEXTURE_2D, 0, 3, im.width (), im.height (), 0, GL_RGB, GL_UNSIGNED_BYTE, im.bits ());\n\n    return texture;\n}\n"

function init() {
	var ta = document.getElementById("edit")
	var newStr = str.replace(/((?:\w+)|(?:[\W\s])|())/g, "<text>$1</text>")
	ta.innerHTML = newStr

	process(ta)
}

function highlight(node, templates, id) {
	if(node.className == "highlighted")
		return

	for(var i = 0; i < templates.length; i++)
		if(node.innerHTML == templates[i]) {
			node.id = id
			node.className = "highlighted"
			return
		}
}

function highlightTypes(root, index) {
	var types = ["void", "int", "char", "long", "float", "double", "bool"]
	return highlight(root.childNodes[index], types, "type")
}

function highlightKeywords(root, index) {
	var keywords = ["for", "do", "while", "if", "else", "return"]
	return highlight(root.childNodes[index], keywords, "keyword")
}

function highlightComments(root, index) {
	if(root.childNodes[index].innerHTML == "/" && root.childNodes[index + 1].innerHTML == "/")
		for(var i = index; root.childNodes[i].innerHTML != "\n"; i++) {
			highlight(root.childNodes[i], [root.childNodes[i].innerHTML], "comment")
		}
}

function highlightDirectives(root, index) {
	if(root.childNodes[index].innerHTML == "#") {
		highlight(root.childNodes[index], [root.childNodes[index].innerHTML], "keyword")
		highlight(root.childNodes[index + 1], [root.childNodes[index + 1].innerHTML], "keyword")
	}
}

function highlightStrValues(root, index) {
	if(root.childNodes[index].innerHTML == "\"" && root.childNodes[index].className != "highlighted") {
		highlight(root.childNodes[index], [root.childNodes[index].innerHTML], "str-value")
		for(var i = index + 1; root.childNodes[i].innerHTML != "\""; i++) {
			highlight(root.childNodes[i], [root.childNodes[i].innerHTML], "str-value")
		}
		highlight(root.childNodes[i], [root.childNodes[i].innerHTML], "str-value")
	}
}

function highlightLbGbIncludes(root, index) {
	if(root.childNodes[index].innerHTML == "&lt;" && root.childNodes[index].className != "highlighted") {
		for(var i = index + 1; root.childNodes[i].innerHTML != "&gt;"; i++) {
			if(root.childNodes[i].innerHTML.search(/[^\w\/]/g) != -1) {
				return
			}
		}

		for(var j = index; j <= i; j++) {
			highlight(root.childNodes[j], [root.childNodes[j].innerHTML], "str-value")
		}
	}
}

function highlightFunctions(root, index) {
	if(root.childNodes[index].innerHTML.search(/\W/g) == -1 && root.childNodes[index].className != "highlighted") {
		for(var i = index + 1; root.childNodes[i].innerHTML.search(/\S/g) == -1; i++) {} // skip spaces

		if(root.childNodes[i].innerHTML != "(")
			return

		for(var i = i + 1; root.childNodes[i].innerHTML != ")"; i++) {} // skip args

		for(var i = i + 1; root.childNodes[i].innerHTML.search(/\S/g) == -1; i++) {} // skip spaces

		if(root.childNodes[i].innerHTML == "{" || root.childNodes[i].innerHTML == ":")
			return highlight(root.childNodes[index], [root.childNodes[index].innerHTML], "func-def")
		else
			return highlight(root.childNodes[index], [root.childNodes[index].innerHTML], "func-call")
	}
}

function highlightConstructor(root, index) {
	if(root.childNodes[index].innerHTML.search(/\W/g) == -1 &&
		root.childNodes[index + 1].innerHTML == ":" && root.childNodes[index + 2].innerHTML == ":" &&
		root.childNodes[index + 3].innerHTML == root.childNodes[index].innerHTML &&
		root.childNodes[index].className != "highlighted") {

		highlight(root.childNodes[index + 3], [root.childNodes[index + 3].innerHTML], "func-def")

		for(var i = index + 4; root.childNodes[i].innerHTML != "{"; i++) {
			if(root.childNodes[i].innerHTML.search(/\W/g) == -1) {
				for(var j = i + 1; root.childNodes[j].innerHTML.search(/\S/g) == -1; j++) {} // skip spaces
					console.log(j, root.childNodes[j])
				
				if(root.childNodes[j].innerHTML == "(") {
					highlight(root.childNodes[i], [root.childNodes[i].innerHTML], "func-call")
					i = j
				}
			}
		}
	}
}

function highlightValues(root, index) {
	highlightStrValues(root, index)
	highlightLbGbIncludes(root, index)
	var val = root.childNodes[index].innerHTML
	if(val == "true" || val == "false") {
		highlight(root.childNodes[index], [val], "int-value")
	} else if(!isNaN(Number(val))) {
		if(index + 1 < root.childNodes.length && root.childNodes[index + 1].innerHTML == ".")
			highlight(root.childNodes[index + 1], ["."], "int-value")
		highlight(root.childNodes[index], [val], "int-value")
	}
}

function process(node) {
	for(var i = 0; i < node.childNodes.length; i++) {
		highlightDirectives(node, i)
		highlightTypes(node, i)
		highlightKeywords(node, i)
		highlightComments(node, i)
		highlightValues(node, i)
		highlightConstructor(node, i)
		highlightFunctions(node, i)

		if(node.childNodes[i].innerHTML == " ")
			node.childNodes[i].innerHTML = "&nbsp;"
	}
}